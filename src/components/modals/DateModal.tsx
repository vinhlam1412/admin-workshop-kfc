import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore, WorkshopDate } from '@/store/AppStore';
import { useToast } from '@/hooks/use-toast';

interface DateModalProps {
  isOpen: boolean;
  onClose: () => void;
  date?: WorkshopDate | null;
}

export function DateModal({ isOpen, onClose, date }: DateModalProps) {
  const { dispatch } = useAppStore();
  const { toast } = useToast();
  const [dateValue, setDateValue] = useState('');

  useEffect(() => {
    if (date) {
      setDateValue(date.date);
    } else {
      setDateValue('');
    }
  }, [date, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateValue) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    if (date) {
      // Edit existing date
      dispatch({
        type: 'UPDATE_WORKSHOP_DATE',
        payload: { ...date, date: dateValue }
      });
      toast({
        title: "Date updated",
        description: "Workshop date has been updated successfully.",
      });
    } else {
      // Add new date
      const newDate: WorkshopDate = {
        id: Date.now().toString(),
        date: dateValue
      };
      dispatch({ type: 'ADD_WORKSHOP_DATE', payload: newDate });
      toast({
        title: "Date added",
        description: "New workshop date has been added successfully.",
      });
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {date ? 'Edit Workshop Date' : 'Add Workshop Date'}
          </DialogTitle>
          <DialogDescription>
            {date ? 'Update the workshop date' : 'Add a new workshop date'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {date ? 'Update' : 'Add'} Date
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}