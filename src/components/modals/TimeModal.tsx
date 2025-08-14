import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore, WorkshopDate, WorkshopTime } from '@/store/AppStore';
import { useToast } from '@/hooks/use-toast';

interface TimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: WorkshopDate | null;
  time?: WorkshopTime | null;
}

export function TimeModal({ isOpen, onClose, date, time }: TimeModalProps) {
  const { dispatch } = useAppStore();
  const { toast } = useToast();
  const [timeValue, setTimeValue] = useState('');
  const [totalSlot, setTotalSlot] = useState('');
  const [remainSlot, setRemainSlot] = useState('');

  useEffect(() => {
    if (time) {
      setTimeValue(time.time);
      setTotalSlot(time.totalSlot.toString());
      setRemainSlot(time.remainSlot.toString());
    } else {
      setTimeValue('');
      setTotalSlot('');
      setRemainSlot('');
    }
  }, [time, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!timeValue || !totalSlot || !remainSlot || !date) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const totalSlotNum = parseInt(totalSlot);
    const remainSlotNum = parseInt(remainSlot);

    if (remainSlotNum > totalSlotNum) {
      toast({
        title: "Error",
        description: "Remaining slots cannot be more than total slots",
        variant: "destructive",
      });
      return;
    }

    if (time) {
      // Edit existing time
      const updatedTime: WorkshopTime = {
        ...time,
        time: timeValue,
        totalSlot: totalSlotNum,
        remainSlot: remainSlotNum
      };
      dispatch({ type: 'UPDATE_WORKSHOP_TIME', payload: updatedTime });
      toast({
        title: "Time slot updated",
        description: "Workshop time slot has been updated successfully.",
      });
    } else {
      // Add new time
      const newTime: WorkshopTime = {
        id: Date.now().toString(),
        idWorkShopDate: date.id,
        time: timeValue,
        totalSlot: totalSlotNum,
        remainSlot: remainSlotNum
      };
      dispatch({ type: 'ADD_WORKSHOP_TIME', payload: newTime });
      toast({
        title: "Time slot added",
        description: "New workshop time slot has been added successfully.",
      });
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {time ? 'Edit Time Slot' : 'Add Time Slot'}
          </DialogTitle>
          <DialogDescription>
            {time ? 'Update the time slot details' : `Add a new time slot for ${date?.date}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="time">Time Slot (e.g., 09:00-10:00)</Label>
            <Input
              id="time"
              type="text"
              placeholder="09:00-10:00"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalSlot">Total Slots</Label>
            <Input
              id="totalSlot"
              type="number"
              min="1"
              placeholder="10"
              value={totalSlot}
              onChange={(e) => setTotalSlot(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remainSlot">Remaining Slots</Label>
            <Input
              id="remainSlot"
              type="number"
              min="0"
              placeholder="10"
              value={remainSlot}
              onChange={(e) => setRemainSlot(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {time ? 'Update' : 'Add'} Time Slot
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}