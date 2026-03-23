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
  gpio: number;
  active: string;
  name?: string;
  master?: boolean;
  enabled?: boolean;
  filterCleanup?: boolean;
}

const SettingsPage: React.FC = () => {
  const [valves, setValves] = useState<Valve[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingValve, setEditingValve] = useState<Valve | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleSaveValve = async () => {
    if (!editingValve) return;
    
    try {
      const updatedValves = valves.map(v => 
        v.id === editingValve.id ? editingValve : v
      );
      
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Valve Configuration</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Valves</CardTitle>
          <CardDescription>Manage your physical sprinkler valves and their GPIO mappings.</CardDescription>
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
                  <TableCell>{valve.name || `Valve ${valve.id}`}</TableCell>
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
                    {valve.master ? "Master" : valve.filterCleanup ? "Filter" : "Zone"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(valve)}>
                      Edit
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
            <DialogTitle>Edit Valve {editingValve?.id}</DialogTitle>
            <DialogDescription>
              Update the configuration for this valve.
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
                  placeholder={`Valve ${editingValve.id}`}
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
