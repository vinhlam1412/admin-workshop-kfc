import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/AppStore';
import { Search, Filter, Users } from 'lucide-react';

export default function CustomerList() {
  const { state } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');

  // Get unique dates and times for filters
  const uniqueDates = Array.from(new Set(state.customerRegistrations.map(reg => reg.workShopDate)));
  const uniqueTimes = Array.from(new Set(state.customerRegistrations.map(reg => reg.workShopTime)));

  // Filter customers based on search and filters
  const filteredCustomers = useMemo(() => {
    return state.customerRegistrations.filter(customer => {
      const matchesSearch = 
        customer.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.parentPhone.includes(searchTerm);
      
      const matchesDate = selectedDate === 'all' || customer.workShopDate === selectedDate;
      const matchesTime = selectedTime === 'all' || customer.workShopTime === selectedTime;

      return matchesSearch && matchesDate && matchesTime;
    });
  }, [state.customerRegistrations, searchTerm, selectedDate, selectedTime]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Customer Registration List</h1>
        <p className="text-muted-foreground">Manage and view workshop registrations</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>
            Search and filter customer registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search by Name or Phone</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Enter name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <Label>Filter by Date</Label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  {uniqueDates.map(date => (
                    <SelectItem key={date} value={date}>{date}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Filter */}
            <div className="space-y-2">
              <Label>Filter by Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Times</SelectItem>
                  {uniqueTimes.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        Showing {filteredCustomers.length} of {state.customerRegistrations.length} registrations
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registrations</CardTitle>
          <CardDescription>
            Complete list of workshop registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No registrations found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedDate !== 'all' || selectedTime !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No customer registrations available yet'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Child Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Workshop Date</TableHead>
                    <TableHead>Workshop Time</TableHead>
                    <TableHead>Parent Phone</TableHead>
                    <TableHead>Bill Number</TableHead>
                    <TableHead>Bill Image</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.parentName}
                      </TableCell>
                      <TableCell>{customer.childName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{customer.childAge}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{customer.workShopDate}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{customer.workShopTime}</Badge>
                      </TableCell>
                      <TableCell>{customer.parentPhone}</TableCell>
                      <TableCell>
                        <Badge className="bg-primary text-primary-foreground">
                          {customer.billNumber}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <img
                          src={customer.imageBill}
                          alt="Bill"
                          className="w-12 h-12 object-cover rounded border"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}