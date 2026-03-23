import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Plus, Trash2, Edit } from "lucide-react";

interface Schedule {
  id?: string;
  name?: string;
  valve_ids: number[];
  duration: number;
  routine: string;
  start_time: string;
  rounds: number;
}

interface Valve {
  id: number;
  name?: string;
}

const Dashboard: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [valves, setValves] = useState<Valve[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule>({
    valve_ids: [],
    duration: 900,
    routine: "Mo",
    start_time: "05:00",
    rounds: 2
  });

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

  const handleSaveSchedule = async () => {
    try {
      // Very basic implementation: overwrite all schedules with the new one added
      // In a real app, you'd add/update the specific one
      const newSchedules = [...schedules, currentSchedule];
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
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Routine
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Routine</DialogTitle>
              <DialogDescription>
                Configure the schedule, duration, and valves for this routine.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
              <CardTitle className="text-xl font-bold">
                {schedule.start_time}
              </CardTitle>
              <Button size="icon" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleRunNow(schedule)}>
                <Play className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 mb-2 font-medium">{schedule.routine}</div>
              <div className="text-sm">
                <span className="font-semibold">Duration:</span> {schedule.duration}s per valve
              </div>
              <div className="text-sm">
                <span className="font-semibold">Rounds:</span> {schedule.rounds}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <span className="font-semibold">Valves:</span> {schedule.valve_ids.join(", ")}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button size="sm" variant="outline"><Edit className="w-4 h-4 mr-1"/> Edit</Button>
              <Button size="sm" variant="destructive"><Trash2 className="w-4 h-4 mr-1"/> Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
