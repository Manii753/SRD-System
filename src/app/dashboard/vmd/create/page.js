'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/lib/use-toast';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function CreateSRDPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sampleRequestDate: '',
    sampleTargetDispatchDate: '',
    sampleType: '',
    refNo: '',
    buyer: '',
    buyerStyleRef: '',
    fit: '',
    washColor: '',
    washComments: '',
    sampleRequestSize: '',
    sampleRequestQty: '',
    costingRequired: '',
    garmentConstruction: '',
    flyDetails: '',
    flyOpeningLength: '',
    loopLengthQty: '',
    loopFusing: '',
    wbFusing: '',
    yokeAttachment: '',
    backRiseAttachment: '',
    inseamAttachment: '',
    fabricCode: '',
    fabricType: '',
    color: '',
    fabricSupplier: '',
    secondaryFabric: '',
    fabricAvailability: '',
    addOns: '',
    beforeWashTrims: {
      topThread: '',
      bottomThread: '',
      bustedThread: '',
      embThread: '',
      trimAvailability: '',
      addOns: ''
    },
    afterWashTrims: {
      puPatch: '',
      mainButton: '',
      mainButtonColor: '',
      flyButton: '',
      flyButtonColor: '',
      rivet: '',
      rivetColor: '',
      trimAvailability: '',
      overrider: '',
      addOns: ''
    },
    embellishments: {
      requiredPrints: '',
      printArea: '',
      printColor: '',
      printArtwork: '',
      printAddOns: '',
      requiredEmbroidery: '',
      embroideryArea: '',
      embroideryColor: '',
      embroideryArtwork: '',
      embroideryAddOns: ''
    }
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'vmd') {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/srd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          refNo: `SRD-${Date.now()}`,
          createdBy: {
            id: session.user.email,
            name: session.user.name,
            role: session.user.role
          },
          status: {
            vmd: 'pending',
            cad: 'pending',
            commercial: 'pending',
            mmc: 'pending'
          },
          vmdFields: {
            sampleRequestDate: formData.sampleRequestDate,
            sampleTargetDispatchDate: formData.sampleTargetDispatchDate,
            sampleType: formData.sampleType,
            refNo: formData.refNo,
            buyer: formData.buyer,
            buyerStyleRef: formData.buyerStyleRef,
            fit: formData.fit,
            washColor: formData.washColor,
            washComments: formData.washComments,
            sampleRequestSize: formData.sampleRequestSize,
            sampleRequestQty: parseInt(formData.sampleRequestQty) || 0,
            costingRequired: formData.costingRequired,
            garmentConstruction: formData.garmentConstruction,
            flyDetails: formData.flyDetails,
            flyOpeningLength: formData.flyOpeningLength,
            loopLengthQty: formData.loopLengthQty,
            loopFusing: formData.loopFusing,
            wbFusing: formData.wbFusing,
            yokeAttachment: formData.yokeAttachment,
            backRiseAttachment: formData.backRiseAttachment,
            inseamAttachment: formData.inseamAttachment,
            fabricCode: formData.fabricCode,
            fabricType: formData.fabricType,
            color: formData.color,
            fabricSupplier: formData.fabricSupplier,
            secondaryFabric: formData.secondaryFabric,
            fabricAvailability: formData.fabricAvailability,
            addOns: formData.addOns,
            beforeWashTrims: formData.beforeWashTrims,
            afterWashTrims: formData.afterWashTrims,
            embellishments: formData.embellishments
          }
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: 'SRD created successfully',
        });
        router.push(`/srd/${data.data.id}`);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create SRD',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create SRD',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/dashboard/vmd">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New SRD</h1>
            <p className="text-gray-600">Fill in the details to create a new sample request</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">SRD Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter SRD title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the sample request"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* VMD Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">VMD Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sampleRequestDate">Sample Request Date</Label>
                  <Input
                    id="sampleRequestDate"
                    type="date"
                    value={formData.sampleRequestDate}
                    onChange={(e) => handleInputChange('sampleRequestDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sampleTargetDispatchDate">Sample Target Dispatch Date</Label>
                  <Input
                    id="sampleTargetDispatchDate"
                    type="date"
                    value={formData.sampleTargetDispatchDate}
                    onChange={(e) => handleInputChange('sampleTargetDispatchDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sampleType">Sample Type</Label>
                  <Input
                    id="sampleType"
                    value={formData.sampleType}
                    onChange={(e) => handleInputChange('sampleType', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="refNo">Ref No</Label>
                  <Input
                    id="refNo"
                    value={formData.refNo}
                    onChange={(e) => handleInputChange('refNo', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buyer">Buyer</Label>
                  <Input
                    id="buyer"
                    value={formData.buyer}
                    onChange={(e) => handleInputChange('buyer', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="buyerStyleRef">Buyer Style Ref</Label>
                  <Input
                    id="buyerStyleRef"
                    value={formData.buyerStyleRef}
                    onChange={(e) => handleInputChange('buyerStyleRef', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fit">Fit</Label>
                  <Input
                    id="fit"
                    value={formData.fit}
                    onChange={(e) => handleInputChange('fit', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="washColor">Wash Color</Label>
                  <Input
                    id="washColor"
                    value={formData.washColor}
                    onChange={(e) => handleInputChange('washColor', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="washComments">Wash Comments</Label>
                <Textarea
                  id="washComments"
                  value={formData.washComments}
                  onChange={(e) => handleInputChange('washComments', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sampleRequestSize">Sample Request Size</Label>
                  <Input
                    id="sampleRequestSize"
                    value={formData.sampleRequestSize}
                    onChange={(e) => handleInputChange('sampleRequestSize', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sampleRequestQty">Sample Request Qty</Label>
                  <Input
                    id="sampleRequestQty"
                    type="number"
                    value={formData.sampleRequestQty}
                    onChange={(e) => handleInputChange('sampleRequestQty', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="costingRequired">Costing Required</Label>
                <Input
                  id="costingRequired"
                  value={formData.costingRequired}
                  onChange={(e) => handleInputChange('costingRequired', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="garmentConstruction">Garment Construction</Label>
                <Textarea
                  id="garmentConstruction"
                  value={formData.garmentConstruction}
                  onChange={(e) => handleInputChange('garmentConstruction', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="flyDetails">Fly Details</Label>
                  <Input
                    id="flyDetails"
                    value={formData.flyDetails}
                    onChange={(e) => handleInputChange('flyDetails', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="flyOpeningLength">Fly Opening Length</Label>
                  <Input
                    id="flyOpeningLength"
                    value={formData.flyOpeningLength}
                    onChange={(e) => handleInputChange('flyOpeningLength', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="loopLengthQty">Loop Length Qty</Label>
                  <Input
                    id="loopLengthQty"
                    value={formData.loopLengthQty}
                    onChange={(e) => handleInputChange('loopLengthQty', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="loopFusing">Loop Fusing</Label>
                  <Input
                    id="loopFusing"
                    value={formData.loopFusing}
                    onChange={(e) => handleInputChange('loopFusing', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wbFusing">WB Fusing</Label>
                  <Input
                    id="wbFusing"
                    value={formData.wbFusing}
                    onChange={(e) => handleInputChange('wbFusing', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="yokeAttachment">Yoke Attachment</Label>
                  <Input
                    id="yokeAttachment"
                    value={formData.yokeAttachment}
                    onChange={(e) => handleInputChange('yokeAttachment', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backRiseAttachment">Back Rise Attachment</Label>
                  <Input
                    id="backRiseAttachment"
                    value={formData.backRiseAttachment}
                    onChange={(e) => handleInputChange('backRiseAttachment', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="inseamAttachment">Inseam Attachment</Label>
                  <Input
                    id="inseamAttachment"
                    value={formData.inseamAttachment}
                    onChange={(e) => handleInputChange('inseamAttachment', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fabricCode">Fabric Code</Label>
                  <Input
                    id="fabricCode"
                    value={formData.fabricCode}
                    onChange={(e) => handleInputChange('fabricCode', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fabricType">Fabric Type</Label>
                  <Input
                    id="fabricType"
                    value={formData.fabricType}
                    onChange={(e) => handleInputChange('fabricType', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fabricSupplier">Fabric Supplier</Label>
                  <Input
                    id="fabricSupplier"
                    value={formData.fabricSupplier}
                    onChange={(e) => handleInputChange('fabricSupplier', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="secondaryFabric">Secondary Fabric</Label>
                  <Input
                    id="secondaryFabric"
                    value={formData.secondaryFabric}
                    onChange={(e) => handleInputChange('secondaryFabric', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fabricAvailability">Fabric Availability</Label>
                  <Input
                    id="fabricAvailability"
                    value={formData.fabricAvailability}
                    onChange={(e) => handleInputChange('fabricAvailability', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="addOns">Add Ons</Label>
                <Textarea
                  id="addOns"
                  value={formData.addOns}
                  onChange={(e) => handleInputChange('addOns', e.target.value)}
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Before Wash Trims</h4>
                <div className="space-y-2 mt-2">
                  <Input placeholder="Top Thread" value={formData.beforeWashTrims.topThread} onChange={(e) => handleInputChange('beforeWashTrims', {...formData.beforeWashTrims, topThread: e.target.value})} />
                  <Input placeholder="Bottom Thread" value={formData.beforeWashTrims.bottomThread} onChange={(e) => handleInputChange('beforeWashTrims', {...formData.beforeWashTrims, bottomThread: e.target.value})} />
                  <Input placeholder="Busted Thread" value={formData.beforeWashTrims.bustedThread} onChange={(e) => handleInputChange('beforeWashTrims', {...formData.beforeWashTrims, bustedThread: e.target.value})} />
                  <Input placeholder="Emb Thread" value={formData.beforeWashTrims.embThread} onChange={(e) => handleInputChange('beforeWashTrims', {...formData.beforeWashTrims, embThread: e.target.value})} />
                  <Input placeholder="Trim Availability" value={formData.beforeWashTrims.trimAvailability} onChange={(e) => handleInputChange('beforeWashTrims', {...formData.beforeWashTrims, trimAvailability: e.target.value})} />
                  <Textarea placeholder="Add Ons" value={formData.beforeWashTrims.addOns} onChange={(e) => handleInputChange('beforeWashTrims', {...formData.beforeWashTrims, addOns: e.target.value})} />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">After Wash Trims</h4>
                <div className="space-y-2 mt-2">
                  <Input placeholder="PU Patch" value={formData.afterWashTrims.puPatch} onChange={(e) => handleInputChange('afterWashTrims', {...formData.afterWashTrims, puPatch: e.target.value})} />
                  <Input placeholder="Main Button" value={formData.afterWashTrims.mainButton} onChange={(e) => handleInputChange('afterWashTrims', {...formData.afterWashTrims, mainButton: e.target.value})} />
                  <Input placeholder="Main Button Color" value={formData.afterWashTrims.mainButtonColor} onChange={(e) => handleInputChange('afterWashTrims', {...formData.afterWashTrims, mainButtonColor: e.target.value})} />
                  <Input placeholder="Fly Button" value={formData.afterWashTrims.flyButton} onChange={(e) => handleInputChange('afterWashTrims', {...formData.afterWashTrims, flyButton: e.target.value})} />
                  <Input placeholder="Fly Button Color" value={formData.afterWashTrims.flyButtonColor} onChange={(e) => handleInputChange('afterWashTrims', {...formData.afterWashTrims, flyButtonColor: e.target.value})} />
                  <Input placeholder="Rivet" value={formData.afterWashTrims.rivet} onChange={(e) => handleInputChange('afterWashTrims', {...formData.afterWashTrims, rivet: e.target.value})} />
                  <Input placeholder="Rivet Color" value={formData.afterWashTrims.rivetColor} onChange={(e) => handleInputChange('afterWashTrims', {...formData.afterWashTrims, rivetColor: e.target.value})} />
                  <Input placeholder="Trim Availability" value={formData.afterWashTrims.trimAvailability} onChange={(e) => handleInputChange('afterWashTrims', {...formData.afterWashTrims, trimAvailability: e.target.value})} />
                  <Input placeholder="Overrider" value={formData.afterWashTrims.overrider} onChange={(e) => handleInputChange('afterWashTrims', {...formData.afterWashTrims, overrider: e.target.value})} />
                  <Textarea placeholder="Add Ons" value={formData.afterWashTrims.addOns} onChange={(e) => handleInputChange('afterWashTrims', {...formData.afterWashTrims, addOns: e.target.value})} />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Embellishments</h4>
                <div className="space-y-2 mt-2">
                  <Input placeholder="Required Prints" value={formData.embellishments.requiredPrints} onChange={(e) => handleInputChange('embellishments', {...formData.embellishments, requiredPrints: e.target.value})} />
                  <Input placeholder="Print Area" value={formData.embellishments.printArea} onChange={(e) => handleInputChange('embellishments', {...formData.embellishments, printArea: e.target.value})} />
                  <Input placeholder="Print Color" value={formData.embellishments.printColor} onChange={(e) => handleInputChange('embellishments', {...formData.embellishments, printColor: e.target.value})} />
                  <Input placeholder="Print Artwork" value={formData.embellishments.printArtwork} onChange={(e) => handleInputChange('embellishments', {...formData.embellishments, printArtwork: e.target.value})} />
                  <Textarea placeholder="Print Add Ons" value={formData.embellishments.printAddOns} onChange={(e) => handleInputChange('embellishments', {...formData.embellishments, printAddOns: e.target.value})} />
                  <Input placeholder="Required Embroidery" value={formData.embellishments.requiredEmbroidery} onChange={(e) => handleInputChange('embellishments', {...formData.embellishments, requiredEmbroidery: e.target.value})} />
                  <Input placeholder="Embroidery Area" value={formData.embellishments.embroideryArea} onChange={(e) => handleInputChange('embellishments', {...formData.embellishments, embroideryArea: e.target.value})} />
                  <Input placeholder="Embroidery Color" value={formData.embellishments.embroideryColor} onChange={(e) => handleInputChange('embellishments', {...formData.embellishments, embroideryColor: e.target.value})} />
                  <Input placeholder="Embroidery Artwork" value={formData.embellishments.embroideryArtwork} onChange={(e) => handleInputChange('embellishments', {...formData.embellishments, embroideryArtwork: e.target.value})} />
                  <Textarea placeholder="Embroidery Add Ons" value={formData.embellishments.embroideryAddOns} onChange={(e) => handleInputChange('embellishments', {...formData.embellishments, embroideryAddOns: e.target.value})} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Link href="/dashboard/vmd">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create SRD
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}