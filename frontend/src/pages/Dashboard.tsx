import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Plus, Trash2, Edit } from "lucide-react";

interface Schedule {
  id?: string;
  name: string;
  valve_ids: number[];
  rain_sensor_id?: number | null;
  duration: number;
  routine: string;
  start_time: string;
  rounds: number;
  round_delay: number;
}

interface Valve {
  id: number;
  name?: string;
  is_input?: boolean;
}

const Dashboard: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [valves, setValves] = useState<Valve[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const defaultSchedule: Schedule = {
    name: "New Routine",
    valve_ids: [],
    rain_sensor_id: null,
    duration: 900,
    routine: "Mo",
    start_time: "05:00",
    rounds: 2,
    round_delay: 5
  };
  
  const [currentSchedule, setCurrentSchedule] = useState<Schedule>(defaultSchedule);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [schedulesRes, valvesRes] = await Promise.all([
        api.get("/api/schedules"),
        api.get("/api/valves")
      ]);
      setSchedules(schedulesRes.data);
      setValves(valvesRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClick = () => {
    setCurrentSchedule(defaultSchedule);
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (schedule: Schedule, index: number) => {
    setCurrentSchedule(schedule);
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleDeleteSchedule = async (index: number) => {
    if (!window.confirm("Are you sure you want to delete this routine?")) return;
    
    try {
      const newSchedules = schedules.filter((_, i) => i !== index);
      await api.post("/api/schedules", newSchedules);
      setSchedules(newSchedules);
    } catch (error) {
      console.error("Failed to delete schedule:", error);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      let newSchedules = [...schedules];
      if (editingIndex !== null) {
        newSchedules[editingIndex] = currentSchedule;
      } else {
        newSchedules.push(currentSchedule);
      }
      await api.post("/api/schedules", newSchedules);
      setSchedules(newSchedules);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save schedule:", error);
    }
  };

  const handleRunNow = async (schedule: Schedule) => {
    try {
      await api.post("/api/run", {
        valves: schedule.valve_ids,
        duration: schedule.duration,
        rounds: schedule.rounds
      });
      alert("Routine started!");
    } catch (error) {
      console.error("Failed to run schedule:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Scheduled Routines</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button className="flex items-center gap-2" onClick={handleAddClick}>
              <Plus className="w-4 h-4" /> Add Routine
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingIndex !== null ? 'Edit Routine' : 'Add New Routine'}</DialogTitle>
              <DialogDescription>
                Configure the schedule, duration, and valves for this routine.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={currentSchedule.name} onChange={e => setCurrentSchedule({...currentSchedule, name: e.target.value})} className="col-span-3" placeholder="Morning Watering" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Start Time</Label>
                <Input id="time" type="time" value={currentSchedule.start_time} onChange={e => setCurrentSchedule({...currentSchedule, start_time: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="days" className="text-right">Days</Label>
                <Input id="days" value={currentSchedule.routine} onChange={e => setCurrentSchedule({...currentSchedule, routine: e.target.value})} placeholder="Mo Tu We Th Fr Sa Su" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">Duration (s)</Label>
                <Input id="duration" type="number" value={currentSchedule.duration} onChange={e => setCurrentSchedule({...currentSchedule, duration: parseInt(e.target.value)})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rounds" className="text-right">Rounds</Label>
                <Input id="rounds" type="number" value={currentSchedule.rounds} onChange={e => setCurrentSchedule({...currentSchedule, rounds: parseInt(e.target.value)})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="round_delay" className="text-right">Round Delay (s)</Label>
                <Input id="round_delay" type="number" value={currentSchedule.round_delay} onChange={e => setCurrentSchedule({...currentSchedule, round_delay: parseInt(e.target.value)})} className="col-span-3" />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4 mt-2">
                <Label className="text-right mt-2">Valves</Label>
                <div className="col-span-3 space-y-2 border p-3 rounded-md">
                  {valves.filter(v => !v.is_input).map(valve => (
                    <div key={valve.id} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={`valve-${valve.id}`}
                        checked={currentSchedule.valve_ids.includes(valve.id)}
                        onChange={(e) => {
                          const newIds = e.target.checked 
                            ? [...currentSchedule.valve_ids, valve.id]
                            : currentSchedule.valve_ids.filter(id => id !== valve.id);
                          setCurrentSchedule({...currentSchedule, valve_ids: newIds});
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={`valve-${valve.id}`} className="cursor-pointer">{valve.name || `Valve ${valve.id}`}</Label>
                    </div>
                  ))}
                  {valves.filter(v => !v.is_input).length === 0 && (
                    <p className="text-sm text-gray-500">No valves configured yet.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rain_sensor" className="text-right">Rain Sensor</Label>
                <select 
                  id="rain_sensor"
                  value={currentSchedule.rain_sensor_id || ""}
                  onChange={e => setCurrentSchedule({...currentSchedule, rain_sensor_id: e.target.value ? parseInt(e.target.value) : null})}
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">None (Ignore Rain)</option>
                  {valves.filter(v => v.is_input).map(sensor => (
                    <option key={sensor.id} value={sensor.id}>
                      {sensor.name || `Sensor ${sensor.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveSchedule}>Save Routine</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schedules.map((schedule, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold flex flex-col">
                <span>{schedule.name}</span>
                <span className="text-sm font-normal text-gray-500">{schedule.start_time}</span>
              </CardTitle>
              <Button size="icon" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleRunNow(schedule)}>
                <Play className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 mb-2 font-medium">{schedule.routine}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-semibold">Duration:</span> {schedule.duration}s</div>
                <div><span className="font-semibold">Delay:</span> {schedule.round_delay}s</div>
                <div><span className="font-semibold">Rounds:</span> {schedule.rounds}</div>
                <div>
                  <span className="font-semibold">Sensor:</span> {
                    schedule.rain_sensor_id !== null 
                      ? valves.find(v => v.id === schedule.rain_sensor_id)?.name || `ID: ${schedule.rain_sensor_id}`
                      : "None"
                  }
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <span className="font-semibold">Valves:</span> {
                  schedule.valve_ids.map(id => valves.find(v => v.id === id)?.name || id).join(", ")
                }
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEditClick(schedule, index)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDeleteSchedule(index)}><Trash2 className="w-4 h-4 mr-1"/> Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
