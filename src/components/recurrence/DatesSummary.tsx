import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Download, Copy } from 'lucide-react';
import { useRecurrence } from '@/contexts/RecurrenceContext';
import { toast } from '@/hooks/use-toast';

export function DatesSummary() {
  const { state } = useRecurrence();

  const copyToClipboard = () => {
    const datesList = state.generatedDates
      .map(date => `${format(date.date, 'PPP')} (${date.type})`)
      .join('\n');
    
    navigator.clipboard.writeText(datesList);
    toast({
      title: "Copied to clipboard",
      description: `${state.generatedDates.length} dates copied to clipboard.`,
    });
  };

  const exportAsJSON = () => {
    const exportData = {
      rule: state.rule,
      generatedDates: state.generatedDates.map(gd => ({
        date: gd.date.toISOString(),
        type: gd.type
      })),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recurring-dates-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Recurring dates exported as JSON file.",
    });
  };

  const getDateBadgeVariant = (type: string) => {
    switch (type) {
      case 'start': return 'default';
      case 'end': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Generated Dates ({state.generatedDates.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={copyToClipboard}
              disabled={state.generatedDates.length === 0}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={exportAsJSON}
              disabled={state.generatedDates.length === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {state.generatedDates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No dates generated yet</p>
            <p className="text-sm">Configure your recurrence pattern to see dates</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-64 w-full">
              <div className="space-y-2">
                {state.generatedDates.slice(0, 50).map((dateObj, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium">
                        {format(dateObj.date, 'EEE, MMM d, yyyy')}
                      </div>
                      <Badge variant={getDateBadgeVariant(dateObj.type)} className="text-xs">
                        {dateObj.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(dateObj.date, 'PPp')}
                    </div>
                  </div>
                ))}
                {state.generatedDates.length > 50 && (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    ... and {state.generatedDates.length - 50} more dates
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {state.errors.length > 0 && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h4 className="text-sm font-medium text-destructive mb-1">Validation Errors</h4>
                <ul className="text-sm text-destructive/80 space-y-1">
                  {state.errors.map((error, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-destructive">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-2 bg-muted rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {state.generatedDates.filter(d => d.type === 'recurring').length}
                </div>
                <div className="text-xs text-muted-foreground">Recurring</div>
              </div>
              <div className="p-2 bg-muted rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {format(state.rule.startDate, 'MMM d')}
                </div>
                <div className="text-xs text-muted-foreground">Start Date</div>
              </div>
              <div className="p-2 bg-muted rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {state.rule.endDate ? format(state.rule.endDate, 'MMM d') : '∞'}
                </div>
                <div className="text-xs text-muted-foreground">End Date</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}