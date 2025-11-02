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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import ImageModal from '@/components/ImageModal';

export default function DepartmentPanel({
  srd,
  department,
  onUpdate,
  isLoading,
  canEdit
}) {
  const [status, setStatus] = useState(srd.status[department]);
  const [fields, setFields] = useState(srd[`${department}Fields`] || {});

  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalIndex, setImageModalIndex] = useState(0);
  console.log('DepartmentPanel fields:', srd.images);

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
                {srd.images && srd.images.length > 0 && (
                  <div className="flex space-x-2">
                    {srd.images.map((img, i) => (
                      <div key={img} className="flex-shrink-0 cursor-pointer" onClick={() => { setImageModalIndex(i); setIsImageModalOpen(true); }}>
                        <Image src={img} width={100} height={100} alt="Image" className="rounded" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Image modal */}
                <ImageModal images={srd.images || []} initialIndex={imageModalIndex} open={isImageModalOpen} onOpenChange={setIsImageModalOpen} />
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sampleRequestDate">Sample Request Date</Label>
                <Input id="sampleRequestDate" type="date" value={fields.sampleRequestDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('sampleRequestDate', e.target.value)} disabled={!canEdit} />
              </div>
              
              <div>
                <Label htmlFor="sampleTargetDispatchDate">Sample Target Dispatch Date</Label>
                <Input id="sampleTargetDispatchDate" type="date" value={fields.sampleTargetDispatchDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('sampleTargetDispatchDate', e.target.value)} disabled={!canEdit} />
              </div>
              <Input placeholder="Sample Type" value={fields.sampleType || ''} onChange={(e) => handleFieldChange('sampleType', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Ref No" value={fields.refNo || ''} onChange={(e) => handleFieldChange('refNo', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Buyer" value={fields.buyer || ''} onChange={(e) => handleFieldChange('buyer', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Buyer Style Ref" value={fields.buyerStyleRef || ''} onChange={(e) => handleFieldChange('buyerStyleRef', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Fit" value={fields.fit || ''} onChange={(e) => handleFieldChange('fit', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Wash Color" value={fields.washColor || ''} onChange={(e) => handleFieldChange('washColor', e.target.value)} disabled={!canEdit} />
              <Textarea placeholder="Wash Comments" value={fields.washComments || ''} onChange={(e) => handleFieldChange('washComments', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Sample Request Size" value={fields.sampleRequestSize || ''} onChange={(e) => handleFieldChange('sampleRequestSize', e.target.value)} disabled={!canEdit} />
              <Input type="number" placeholder="Sample Request Qty" value={fields.sampleRequestQty || ''} onChange={(e) => handleFieldChange('sampleRequestQty', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Costing Required" value={fields.costingRequired || ''} onChange={(e) => handleFieldChange('costingRequired', e.target.value)} disabled={!canEdit} />
              <Textarea placeholder="Garment Construction" value={fields.garmentConstruction || ''} onChange={(e) => handleFieldChange('garmentConstruction', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Fly Details" value={fields.flyDetails || ''} onChange={(e) => handleFieldChange('flyDetails', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Fly Opening Length" value={fields.flyOpeningLength || ''} onChange={(e) => handleFieldChange('flyOpeningLength', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Loop Length Qty" value={fields.loopLengthQty || ''} onChange={(e) => handleFieldChange('loopLengthQty', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Loop Fusing" value={fields.loopFusing || ''} onChange={(e) => handleFieldChange('loopFusing', e.target.value)} disabled={!canEdit} />
              <Input placeholder="WB Fusing" value={fields.wbFusing || ''} onChange={(e) => handleFieldChange('wbFusing', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Yoke Attachment" value={fields.yokeAttachment || ''} onChange={(e) => handleFieldChange('yokeAttachment', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Back Rise Attachment" value={fields.backRiseAttachment || ''} onChange={(e) => handleFieldChange('backRiseAttachment', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Inseam Attachment" value={fields.inseamAttachment || ''} onChange={(e) => handleFieldChange('inseamAttachment', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Fabric Code" value={fields.fabricCode || ''} onChange={(e) => handleFieldChange('fabricCode', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Fabric Type" value={fields.fabricType || ''} onChange={(e) => handleFieldChange('fabricType', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Color" value={fields.color || ''} onChange={(e) => handleFieldChange('color', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Fabric Supplier" value={fields.fabricSupplier || ''} onChange={(e) => handleFieldChange('fabricSupplier', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Secondary Fabric" value={fields.secondaryFabric || ''} onChange={(e) => handleFieldChange('secondaryFabric', e.target.value)} disabled={!canEdit} />
              <Input placeholder="Fabric Availability" value={fields.fabricAvailability || ''} onChange={(e) => handleFieldChange('fabricAvailability', e.target.value)} disabled={!canEdit} />
              <Textarea placeholder="Add Ons" value={fields.addOns || ''} onChange={(e) => handleFieldChange('addOns', e.target.value)} disabled={!canEdit} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Before Wash Trims</h4>
              <div className="space-y-2 mt-2">
                <Input placeholder="Top Thread" value={fields.beforeWashTrims?.topThread || ''} onChange={(e) => handleFieldChange('beforeWashTrims', { ...fields.beforeWashTrims, topThread: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Bottom Thread" value={fields.beforeWashTrims?.bottomThread || ''} onChange={(e) => handleFieldChange('beforeWashTrims', { ...fields.beforeWashTrims, bottomThread: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Busted Thread" value={fields.beforeWashTrims?.bustedThread || ''} onChange={(e) => handleFieldChange('beforeWashTrims', { ...fields.beforeWashTrims, bustedThread: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Emb Thread" value={fields.beforeWashTrims?.embThread || ''} onChange={(e) => handleFieldChange('beforeWashTrims', { ...fields.beforeWashTrims, embThread: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Trim Availability" value={fields.beforeWashTrims?.trimAvailability || ''} onChange={(e) => handleFieldChange('beforeWashTrims', { ...fields.beforeWashTrims, trimAvailability: e.target.value })} disabled={!canEdit} />
                <Textarea placeholder="Add Ons" value={fields.beforeWashTrims?.addOns || ''} onChange={(e) => handleFieldChange('beforeWashTrims', { ...fields.beforeWashTrims, addOns: e.target.value })} disabled={!canEdit} />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">After Wash Trims</h4>
              <div className="space-y-2 mt-2">
                <Input placeholder="PU Patch" value={fields.afterWashTrims?.puPatch || ''} onChange={(e) => handleFieldChange('afterWashTrims', { ...fields.afterWashTrims, puPatch: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Main Button" value={fields.afterWashTrims?.mainButton || ''} onChange={(e) => handleFieldChange('afterWashTrims', { ...fields.afterWashTrims, mainButton: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Main Button Color" value={fields.afterWashTrims?.mainButtonColor || ''} onChange={(e) => handleFieldChange('afterWashTrims', { ...fields.afterWashTrims, mainButtonColor: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Fly Button" value={fields.afterWashTrims?.flyButton || ''} onChange={(e) => handleFieldChange('afterWashTrims', { ...fields.afterWashTrims, flyButton: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Fly Button Color" value={fields.afterWashTrims?.flyButtonColor || ''} onChange={(e) => handleFieldChange('afterWashTrims', { ...fields.afterWashTrims, flyButtonColor: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Rivet" value={fields.afterWashTrims?.rivet || ''} onChange={(e) => handleFieldChange('afterWashTrims', { ...fields.afterWashTrims, rivet: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Rivet Color" value={fields.afterWashTrims?.rivetColor || ''} onChange={(e) => handleFieldChange('afterWashTrims', { ...fields.afterWashTrims, rivetColor: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Trim Availability" value={fields.afterWashTrims?.trimAvailability || ''} onChange={(e) => handleFieldChange('afterWashTrims', { ...fields.afterWashTrims, trimAvailability: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Overrider" value={fields.afterWashTrims?.overrider || ''} onChange={(e) => handleFieldChange('afterWashTrims', { ...fields.afterWashTrims, overrider: e.target.value })} disabled={!canEdit} />
                <Textarea placeholder="Add Ons" value={fields.afterWashTrims?.addOns || ''} onChange={(e) => handleFieldChange('afterWashTrims', { ...fields.afterWashTrims, addOns: e.target.value })} disabled={!canEdit} />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Embellishments</h4>
              <div className="space-y-2 mt-2">
                <Input placeholder="Required Prints" value={fields.embellishments?.requiredPrints || ''} onChange={(e) => handleFieldChange('embellishments', { ...fields.embellishments, requiredPrints: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Print Area" value={fields.embellishments?.printArea || ''} onChange={(e) => handleFieldChange('embellishments', { ...fields.embellishments, printArea: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Print Color" value={fields.embellishments?.printColor || ''} onChange={(e) => handleFieldChange('embellishments', { ...fields.embellishments, printColor: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Print Artwork" value={fields.embellishments?.printArtwork || ''} onChange={(e) => handleFieldChange('embellishments', { ...fields.embellishments, printArtwork: e.target.value })} disabled={!canEdit} />
                <Textarea placeholder="Print Add Ons" value={fields.embellishments?.printAddOns || ''} onChange={(e) => handleFieldChange('embellishments', { ...fields.embellishments, printAddOns: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Required Embroidery" value={fields.embellishments?.requiredEmbroidery || ''} onChange={(e) => handleFieldChange('embellishments', { ...fields.embellishments, requiredEmbroidery: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Embroidery Area" value={fields.embellishments?.embroideryArea || ''} onChange={(e) => handleFieldChange('embellishments', { ...fields.embellishments, embroideryArea: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Embroidery Color" value={fields.embellishments?.embroideryColor || ''} onChange={(e) => handleFieldChange('embellishments', { ...fields.embellishments, embroideryColor: e.target.value })} disabled={!canEdit} />
                <Input placeholder="Embroidery Artwork" value={fields.embellishments?.embroideryArtwork || ''} onChange={(e) => handleFieldChange('embellishments', { ...fields.embellishments, embroideryArtwork: e.target.value })} disabled={!canEdit} />
                <Textarea placeholder="Embroidery Add Ons" value={fields.embellishments?.embroideryAddOns || ''} onChange={(e) => handleFieldChange('embellishments', { ...fields.embellishments, embroideryAddOns: e.target.value })} disabled={!canEdit} />
              </div>
            </div>
          </div>
        );

      case 'cad':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="consumption">Consumption</Label>
                <Input id="consumption" value={fields.consumption || ''} onChange={(e) => handleFieldChange('consumption', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="rollNo">Roll No</Label>
                <Input id="rollNo" value={fields.rollNo || ''} onChange={(e) => handleFieldChange('rollNo', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="shrinkage">Shrinkage</Label>
                <Input id="shrinkage" value={fields.shrinkage || ''} onChange={(e) => handleFieldChange('shrinkage', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="width">Width</Label>
                <Input id="width" value={fields.width || ''} onChange={(e) => handleFieldChange('width', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="beltTracing">Belt Tracing</Label>
                <Input id="beltTracing" value={fields.beltTracing || ''} onChange={(e) => handleFieldChange('beltTracing', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="consumptionWidth">Consumption Width</Label>
                <Input id="consumptionWidth" value={fields.consumptionWidth || ''} onChange={(e) => handleFieldChange('consumptionWidth', e.target.value)} disabled={!canEdit} />
              </div>
            </div>
          </div>
        );

      case 'commercial':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input id="requiredQty" value={fields.requiredQty || ''} onChange={(e) => handleFieldChange('requiredQty', e.target.value)} disabled={!canEdit} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="fabricInStock" checked={fields.fabricInStock} onCheckedChange={(checked) => handleFieldChange('fabricInStock', checked)} disabled={!canEdit} />
                <Label htmlFor="fabricInStock">Fabric In Stock</Label>
              </div>
              {!fields.fabricInStock && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                  <div>
                    <Label htmlFor="orderPlacedDate">Order Placed Date</Label>
                    <Input id="orderPlacedDate" type="date" value={fields.orderPlacedDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('orderPlacedDate', e.target.value)} disabled={!canEdit} />
                  </div>
                  <div>
                    <Label htmlFor="fabricReceivedDate">Fabric Received Date</Label>
                    <Input id="fabricReceivedDate" type="date" value={fields.fabricReceivedDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('fabricReceivedDate', e.target.value)} disabled={!canEdit} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="beforeWashTrimsInStock" checked={fields.beforeWashTrims?.inStock} onCheckedChange={(checked) => handleFieldChange('beforeWashTrims', { ...fields.beforeWashTrims, inStock: checked })} disabled={!canEdit} />
                <Label htmlFor="beforeWashTrimsInStock">Before Wash Trims In Stock</Label>
              </div>
              {!fields.beforeWashTrims?.inStock && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                  <div>
                    <Label htmlFor="bwt_orderPlacedDate">Order Placed Date</Label>
                    <Input id="bwt_orderPlacedDate" type="date" value={fields.beforeWashTrims?.orderPlacedDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('beforeWashTrims', { ...fields.beforeWashTrims, orderPlacedDate: e.target.value })} disabled={!canEdit} />
                  </div>
                  <div>
                    <Label htmlFor="bwt_receivedDate">Received Date</Label>
                    <Input id="bwt_receivedDate" type="date" value={fields.beforeWashTrims?.receivedDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('beforeWashTrims', { ...fields.beforeWashTrims, receivedDate: e.target.value })} disabled={!canEdit} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="afterWashTrimsInStock" checked={fields.afterWashTrims?.inStock} onCheckedChange={(checked) => handleFieldChange('afterWashTrims', { ...fields.afterWashTrims, inStock: checked })} disabled={!canEdit} />
                <Label htmlFor="afterWashTrimsInStock">After Wash Trims In Stock</Label>
              </div>
              {!fields.afterWashTrims?.inStock && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                  <div>
                    <Label htmlFor="awt_orderPlacedDate">Order Placed Date</Label>
                    <Input id="awt_orderPlacedDate" type="date" value={fields.afterWashTrims?.orderPlacedDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('afterWashTrims', { ...fields.afterWashTrims, orderPlacedDate: e.target.value })} disabled={!canEdit} />
                  </div>
                  <div>
                    <Label htmlFor="awt_receivedDate">Received Date</Label>
                    <Input id="awt_receivedDate" type="date" value={fields.afterWashTrims?.receivedDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('afterWashTrims', { ...fields.afterWashTrims, receivedDate: e.target.value })} disabled={!canEdit} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="embellishmentsInStock" checked={fields.embellishments?.inStock} onCheckedChange={(checked) => handleFieldChange('embellishments', { ...fields.embellishments, inStock: checked })} disabled={!canEdit} />
                <Label htmlFor="embellishmentsInStock">Embellishments In Stock</Label>
              </div>
              {!fields.embellishments?.inStock && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                  <div>
                    <Label htmlFor="emb_orderPlacedDate">Order Placed Date</Label>
                    <Input id="emb_orderPlacedDate" type="date" value={fields.embellishments?.orderPlacedDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('embellishments', { ...fields.embellishments, orderPlacedDate: e.target.value })} disabled={!canEdit} />
                  </div>
                  <div>
                    <Label htmlFor="emb_receivedDate">Received Date</Label>
                    <Input id="emb_receivedDate" type="date" value={fields.embellishments?.receivedDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('embellishments', { ...fields.embellishments, receivedDate: e.target.value })} disabled={!canEdit} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="additionalComments">Additional Comments</Label>
              <Textarea id="additionalComments" value={fields.additionalComments || ''} onChange={(e) => handleFieldChange('additionalComments', e.target.value)} disabled={!canEdit} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="actualDispatchDate">Actual Dispatch Date</Label>
                <Input id="actualDispatchDate" type="date" value={fields.actualDispatchDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('actualDispatchDate', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="sampleDispatchDate">Sample Dispatch Date</Label>
                <Input id="sampleDispatchDate" type="date" value={fields.sampleDispatchDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('sampleDispatchDate', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="numberOfSamples">Number of Samples</Label>
                <Input id="numberOfSamples" value={fields.numberOfSamples || ''} onChange={(e) => handleFieldChange('numberOfSamples', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="samplesCheckedBy">Samples Checked By</Label>
                <Input id="samplesCheckedBy" value={fields.samplesCheckedBy || ''} onChange={(e) => handleFieldChange('samplesCheckedBy', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="awbNumber">AWB Number</Label>
                <Input id="awbNumber" value={fields.awbNumber || ''} onChange={(e) => handleFieldChange('awbNumber', e.target.value)} disabled={!canEdit} />
              </div>
            </div>
          </div>
        );

      case 'mmc':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trimInStock">Trim In Stock</Label>
                <Input id="trimInStock" value={fields.trimInStock || ''} onChange={(e) => handleFieldChange('trimInStock', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="orderPlaced">Order Placed</Label>
                <Input id="orderPlaced" value={fields.orderPlaced || ''} onChange={(e) => handleFieldChange('orderPlaced', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="orderPlacedDate">Order Placed Date</Label>
                <Input id="orderPlacedDate" type="date" value={fields.orderPlacedDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('orderPlacedDate', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="trimReceivedDate">Trim Received Date</Label>
                <Input id="trimReceivedDate" type="date" value={fields.trimReceivedDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('trimReceivedDate', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="materialSentDate">Material Sent Date</Label>
                <Input id="materialSentDate" type="date" value={fields.materialSentDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('materialSentDate', e.target.value)} disabled={!canEdit} />
              </div>
              <div>
                <Label htmlFor="materialReceivedDate">Material Received Date</Label>
                <Input id="materialReceivedDate" type="date" value={fields.materialReceivedDate?.split('T')[0] || ''} onChange={(e) => handleFieldChange('materialReceivedDate', e.target.value)} disabled={!canEdit} />
              </div>
            </div>
          </div>
        );

      default:
        return <Alert><AlertCircle className="h-4 w-4" /><AlertDescription>No fields defined for this department.</AlertDescription></Alert>;
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

        {canEdit && (
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

              <Button
                onClick={() => handleUpdate(status)}
                disabled={isSubmitting}
                className="px-4 py-2"
              >
                {isSubmitting ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
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