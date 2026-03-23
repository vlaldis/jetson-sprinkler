import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Valve {
  id: number;
  name?: string;
  gpio: number;
  is_input?: boolean;
  enabled?: boolean;
  active: string;
}

const SettingsPage: React.FC = () => {
  const [valves, setValves] = useState<Valve[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingValve, setEditingValve] = useState<Valve | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const defaultNewValve: Valve = {
    id: 0, // Will be generated based on existing ids on save
    name: "New Valve",
    gpio: 0,
    is_input: false,
    enabled: true,
    active: "high"
  };

  const fetchValves = async () => {
    try {
      const response = await api.get("/api/valves");
      setValves(response.data);
    } catch (error) {
      console.error("Failed to fetch valves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValves();
  }, []);

  const handleEditClick = (valve: Valve) => {
    setEditingValve({ ...valve });
    setIsDialogOpen(true);
  };

  const handleAddValve = (isInput: boolean = false) => {
    const nextId = valves.length > 0 ? Math.max(...valves.map(v => v.id)) + 1 : 1;
    setEditingValve({ 
      ...defaultNewValve, 
      id: nextId, 
      name: isInput ? "New Rain Sensor" : "New Valve",
      is_input: isInput 
    });
    setIsDialogOpen(true);
  };

  const handleDeleteValve = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this valve/sensor?")) return;
    
    try {
      const updatedValves = valves.filter(v => v.id !== id);
      await api.post("/api/valves", updatedValves);
      setValves(updatedValves);
    } catch (error) {
      console.error("Failed to delete valve:", error);
    }
  };

  const handleSaveValve = async () => {
    if (!editingValve) return;

    try {
      let updatedValves = [...valves];
      const existingIndex = valves.findIndex(v => v.id === editingValve.id);
      
      if (existingIndex >= 0) {
        updatedValves[existingIndex] = editingValve;
      } else {
        updatedValves.push(editingValve);
      }

      await api.post("/api/valves", updatedValves);
      setValves(updatedValves);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save valve:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Hardware Configuration</h1>
        <div className="flex gap-2">
          <Button onClick={() => handleAddValve(false)}>Add Valve</Button>
          <Button variant="secondary" onClick={() => handleAddValve(true)}>Add Rain Sensor</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Hardware</CardTitle>
          <CardDescription>Manage your physical sprinkler valves, rain sensors, and their GPIO mappings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>GPIO Pin</TableHead>
                <TableHead>Active State</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {valves.map((valve) => (
                <TableRow key={valve.id}>
                  <TableCell className="font-medium">{valve.id}</TableCell>
                  <TableCell>{valve.name || `Device ${valve.id}`}</TableCell>
                  <TableCell>{valve.gpio}</TableCell>
                  <TableCell className="uppercase">{valve.active}</TableCell>
                  <TableCell>
                    {valve.enabled === false ? (
                      <span className="text-red-500 font-medium">Disabled</span>
                    ) : (
                      <span className="text-green-500 font-medium">Enabled</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {valve.is_input ? "Sensor (Input)" : "Valve (Output)"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(valve)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteValve(valve.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingValve?.id ? 'Edit' : 'Add'} {editingValve?.is_input ? 'Rain Sensor' : 'Valve'}</DialogTitle>
            <DialogDescription>
              Update the hardware configuration mapping.
            </DialogDescription>
          </DialogHeader>
          {editingValve && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={editingValve.name || ""}
                  onChange={e => setEditingValve({...editingValve, name: e.target.value})}
                  placeholder={`Device ${editingValve.id}`}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gpio" className="text-right">GPIO Pin</Label>
                <Input
                  id="gpio"
                  type="number"
                  value={editingValve.gpio}
                  onChange={e => setEditingValve({...editingValve, gpio: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">Active State</Label>
                <select 
                  id="active"
                  value={editingValve.active}
                  onChange={e => setEditingValve({...editingValve, active: e.target.value})}
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="enabled" className="text-right">Enabled</Label>
                <div className="col-span-3 flex items-center">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={editingValve.enabled !== false} 
                    onChange={e => setEditingValve({...editingValve, enabled: e.target.checked})} 
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleSaveValve}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
