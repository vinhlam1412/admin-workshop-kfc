import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore, WorkshopDate, WorkshopTime } from '@/store/AppStore';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { DateModal } from '@/components/modals/DateModal';
import { TimeModal } from '@/components/modals/TimeModal';
import { useToast } from '@/hooks/use-toast';

export default function WorkshopSetup() {
  const { state, dispatch } = useAppStore();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<WorkshopDate | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<WorkshopDate | null>(null);
  const [editingTime, setEditingTime] = useState<WorkshopTime | null>(null);

  const handleAddDate = () => {
    setEditingDate(null);
    setIsDateModalOpen(true);
  };

  const handleEditDate = (date: WorkshopDate) => {
    setEditingDate(date);
    setIsDateModalOpen(true);
  };

  const handleDeleteDate = (dateId: string) => {
    dispatch({ type: 'DELETE_WORKSHOP_DATE', payload: dateId });
    toast({
      title: "Date deleted",
      description: "Workshop date and all its time slots have been removed.",
    });
  };

  const handleAddTime = (date: WorkshopDate) => {
    setSelectedDate(date);
    setEditingTime(null);
    setIsTimeModalOpen(true);
  };

  const handleEditTime = (time: WorkshopTime) => {
    const date = state.workshopDates.find(d => d.id === time.idWorkShopDate);
    setSelectedDate(date || null);
    setEditingTime(time);
    setIsTimeModalOpen(true);
  };

  const handleDeleteTime = (timeId: string) => {
    dispatch({ type: 'DELETE_WORKSHOP_TIME', payload: timeId });
    toast({
      title: "Time slot deleted",
      description: "The time slot has been removed.",
    });
  };

  const getTimesForDate = (dateId: string) => {
    return state.workshopTimes.filter(time => time.idWorkShopDate === dateId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workshop Setup</h1>
          <p className="text-muted-foreground">Manage workshop dates and time slots</p>
        </div>
        {/* <Button onClick={handleAddDate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Date
        </Button> */}
      </div>

      {/* Workshop Dates */}
      <div className="space-y-4">
        {state.workshopDates.map((date) => {
          const times = getTimesForDate(date.id);
          return (
            <Card key={date.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{date.date}</CardTitle>
                      <CardDescription>
                        {times.length} time slot{times.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTime(date)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Time
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditDate(date)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDate(date.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button> */}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {times.length === 0 ? (
                  <p className="text-muted-foreground italic">No time slots added yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {times.map((time) => (
                      <div
                        key={time.id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{time.time}</span>
                          </div>
                          <div className="flex gap-1">
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTime(time)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTime(time.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button> */}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Total Slots:</span>
                            <Badge variant="outline">{time.totalSlot}</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Remaining:</span>
                            <Badge 
                              variant={time.remainSlot === 0 ? "destructive" : "secondary"}
                            >
                              {time.remainSlot}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {state.workshopDates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No workshop dates yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first workshop date
            </p>
            {/* <Button onClick={handleAddDate}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Date
            </Button> */}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <DateModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        date={editingDate}
      />
      <TimeModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        date={selectedDate}
        time={editingTime}
      />
    </div>
  );
}