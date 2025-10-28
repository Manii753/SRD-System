'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';


export default function CadSubprocessPanel({ 
  srd, 
  onUpdate, 
  isLoading 
}) {
  const [subprocesses, setSubprocesses] = useState(srd.cadSubprocesses || {});

  const subprocessConfig = [
    {
      id: 'sewing',
      name: 'Sewing',
      
      description: 'Initial sewing operations'
    },
    {
      id: 'stitching',
      name: 'Stitching',
      
      description: 'Detailed stitching work'
    },
    {
      id: 'cutting',
      name: 'Cutting',
      
      description: 'Fabric cutting operations'
    },
    {
      id: 'finishing',
      name: 'Finishing',
      
      description: 'Final finishing touches'
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-gray-100 text-gray-800',
          
          label: 'Pending'
        };
      case 'in-progress':
        return {
          color: 'bg-blue-100 text-blue-800',
          
          label: 'In Progress'
        };
      case 'done':
        return {
          color: 'bg-green-100 text-green-800',
          
          label: 'Completed'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          
          label: 'Pending'
        };
    }
  };

  const handleStatusChange = async (subprocessId, newStatus) => {
    const updatedSubprocesses = {
      ...subprocesses,
      [subprocessId]: newStatus
    };
    
    setSubprocesses(updatedSubprocesses);
    
    try {
      await onUpdate({
        cadSubprocesses: updatedSubprocesses
      });
      
      // Check if all subprocesses are done
      const allDone = Object.values(updatedSubprocesses).every(status => status === 'done');
      if (allDone && srd.status.cad !== 'approved') {
        // Auto-approve CAD if all subprocesses are done
        await onUpdate({
          cadSubprocesses: updatedSubprocesses,
          status: {
            ...srd.status,
            cad: 'approved'
          }
        });
      }
    } catch (error) {
      console.error('Failed to update subprocess:', error);
      // Revert on error
      setSubprocesses(srd.cadSubprocesses || {});
    }
  };

  const getOverallProgress = () => {
    const total = subprocessConfig.length;
    const completed = Object.values(subprocesses).filter(status => status === 'done').length;
    return Math.round((completed / total) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            CAD Subprocesses
          </CardTitle>
          <Badge className="bg-blue-100 text-blue-800">
            {getOverallProgress()}% Complete
          </Badge>
        </div>
        <Progress value={getOverallProgress()} className="mt-2" />
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subprocessConfig.map((subprocess) => {
            const StatusIcon = getStatusConfig(subprocesses[subprocess.id]).icon;
            const statusClass = getStatusConfig(subprocesses[subprocess.id]).color;
            const SubprocessIcon = subprocess.icon;
            
            return (
              <div
                key={subprocess.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <SubprocessIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{subprocess.name}</h4>
                      <p className="text-sm text-gray-500">{subprocess.description}</p>
                    </div>
                  </div>
                  
                  <Badge className={statusClass}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {getStatusConfig(subprocesses[subprocess.id]).label}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={subprocesses[subprocess.id] || 'pending'}
                    onChange={(e) => handleStatusChange(subprocess.id, e.target.value)}
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                  
                  {subprocesses[subprocess.id] === 'done' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              When all subprocesses are marked as completed, the CAD department status will be automatically updated to "Approved".
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}