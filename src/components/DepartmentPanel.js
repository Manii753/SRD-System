'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DepartmentPanel({ 
  srd, 
  department, 
  onUpdate, 
  isLoading 
}) {
  const [status, setStatus] = useState(srd.status[department]);
  const [fields, setFields] = useState(srd[`${department}Fields`] || {});
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field, value) => {
    setFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'flagged') {
      setShowFlagDialog(true);
    } else {
      setStatus(newStatus);
      handleUpdate(newStatus);
    }
  };

  const handleFlagSubmit = () => {
    if (!flagComment.trim()) {
      return;
    }
    
    setStatus('flagged');
    handleUpdate('flagged', flagComment);
    setShowFlagDialog(false);
    setFlagComment('');
  };

  const handleUpdate = async (newStatus, comment = null) => {
    setIsSubmitting(true);
    
    const updateData = {
      status: newStatus,
      fields: fields,
      department: department
    };
    
    if (comment) {
      updateData.comment = {
        author: 'Current User', // This should come from session
        role: department,
        text: comment
      };
    }
    
    try {
      await onUpdate(updateData);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDepartmentFields = () => {
    switch (department) {
      case 'vmd':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={fields.priority || ''}
                onChange={(e) => handleFieldChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={fields.deadline ? fields.deadline.split('T')[0] : ''}
                onChange={(e) => handleFieldChange('deadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material Type
              </label>
              <input
                type="text"
                value={fields.materialType || ''}
                onChange={(e) => handleFieldChange('materialType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Cotton, Polyester"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={fields.quantity || ''}
                onChange={(e) => handleFieldChange('quantity', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specifications
              </label>
              <textarea
                value={fields.specifications || ''}
                onChange={(e) => handleFieldChange('specifications', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter detailed specifications"
              />
            </div>
          </div>
        );
        
      case 'cad':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consumption
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={fields.consumption || ''}
                  onChange={(e) => handleFieldChange('consumption', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={fields.rollNumber || ''}
                  onChange={(e) => handleFieldChange('rollNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., CAD-001"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shrinkage %
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={fields.shrinkage || ''}
                  onChange={(e) => handleFieldChange('shrinkage', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={fields.width || ''}
                  onChange={(e) => handleFieldChange('width', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Belt Tracing
                </label>
                <input
                  type="text"
                  value={fields.beltTracing || ''}
                  onChange={(e) => handleFieldChange('beltTracing', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Standard, Custom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consumption Width
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={fields.consumptionWidth || ''}
                  onChange={(e) => handleFieldChange('consumptionWidth', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>
        );
        
      case 'commercial':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <input
                type="text"
                value={fields.supplier || ''}
                onChange={(e) => handleFieldChange('supplier', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Supplier name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost per unit
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={fields.cost || ''}
                  onChange={(e) => handleFieldChange('cost', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lead Time (days)
                </label>
                <input
                  type="number"
                  value={fields.leadTime || ''}
                  onChange={(e) => handleFieldChange('leadTime', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  value={fields.availability || ''}
                  onChange={(e) => handleFieldChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Availability</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Limited">Limited</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Pre-order">Pre-order</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quotation Number
                </label>
                <input
                  type="text"
                  value={fields.quotation || ''}
                  onChange={(e) => handleFieldChange('quotation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="QUO-2024-XXX"
                />
              </div>
            </div>
          </div>
        );
        
      case 'mmc':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Machine Requirements
              </label>
              <input
                type="text"
                value={fields.machineRequirements || ''}
                onChange={(e) => handleFieldChange('machineRequirements', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Standard sewing machine"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Production Time (minutes)
                </label>
                <input
                  type="number"
                  value={fields.productionTime || ''}
                  onChange={(e) => handleFieldChange('productionTime', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality Check
                </label>
                <input
                  type="text"
                  value={fields.qualityCheck || ''}
                  onChange={(e) => handleFieldChange('qualityCheck', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., ISO 9001"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Packaging Requirements
              </label>
              <input
                type="text"
                value={fields.packaging || ''}
                onChange={(e) => handleFieldChange('packaging', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Individual polybags"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Instructions
              </label>
              <textarea
                value={fields.shipping || ''}
                onChange={(e) => handleFieldChange('shipping', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter shipping instructions"
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {department.toUpperCase()} Department
        </CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Status:</span>
          <Badge className={cn(
            status === 'approved' && 'bg-green-100 text-green-800',
            status === 'in-progress' && 'bg-blue-100 text-blue-800',
            status === 'flagged' && 'bg-red-100 text-red-800',
            status === 'pending' && 'bg-gray-100 text-gray-800'
          )}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderDepartmentFields()}
        
        {/* Status Update Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Update Status</h4>
          <div className="flex items-center space-x-3">
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="approved">Approved</option>
              <option value="flagged">Flag Issue</option>
            </select>
            
            {status !== 'flagged' && (
              <Button
                onClick={() => handleUpdate(status)}
                disabled={isSubmitting}
                className="px-4 py-2"
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag SRD Issue</DialogTitle>
          </DialogHeader>
          
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please provide a detailed explanation of the issue. This comment will be visible to all departments.
            </AlertDescription>
          </Alert>
          
          <Textarea
            value={flagComment}
            onChange={(e) => setFlagComment(e.target.value)}
            placeholder="Describe the issue..."
            className="min-h-[100px]"
          />
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowFlagDialog(false);
                setFlagComment('');
                setStatus(srd.status[department]); // Reset status
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFlagSubmit}
              disabled={!flagComment.trim() || isSubmitting}
              variant="destructive"
            >
              {isSubmitting ? 'Flagging...' : 'Flag Issue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}