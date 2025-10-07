import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, MapPin, Globe, Mail, Clock, 
  Search, Loader2, ExternalLink 
} from 'lucide-react';
import { contentService, MentalHealthResource } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';

const ResourceDirectory: React.FC = () => {
  const [resources, setResources] = useState<MentalHealthResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await contentService.getResources();
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load resources:', error);
      setResources([]);
      toast({
        title: 'Error',
        description: 'Failed to load resources. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.services_offered?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
    r.specializations?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
    r.age_groups_served?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
    r.languages?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getResourceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'crisis_line': 'bg-red-100 text-red-800',
      'clinic': 'bg-blue-100 text-blue-800',
      'hospital': 'bg-purple-100 text-purple-800',
      'counselor': 'bg-green-100 text-green-800',
      'support_group': 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-healthcare-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-16 sm:pt-20 md:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 mt-4 sm:mt-6 md:mt-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Resource Directory</h1>
          <p className="text-gray-600 text-sm sm:text-base">Find mental health resources and support services</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {filteredResources.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No resources found</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your search</p>
              </CardContent>
            </Card>
          ) : (
            filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{resource.name}</CardTitle>
                        <Badge className={getResourceTypeColor(resource.resource_type)}>
                          {resource.resource_type.replace('_', ' ')}
                        </Badge>
                        {resource.is_24_7 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            24/7
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{resource.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {resource.phone_number && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${resource.phone_number}`} className="hover:text-healthcare-primary">
                          {resource.phone_number}
                        </a>
                      </div>
                    )}
                    {resource.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${resource.email}`} className="hover:text-healthcare-primary">
                          {resource.email}
                        </a>
                      </div>
                    )}
                    {resource.website && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="w-4 h-4" />
                        <a 
                          href={resource.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-healthcare-primary flex items-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {resource.address && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 mt-1" />
                        <span>{resource.address}, {resource.city}, {resource.state}</span>
                      </div>
                    )}
                    {resource.services_offered && resource.services_offered.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {resource.services_offered.map((service, idx) => (
                          <Badge key={idx} variant="outline">{service}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-red-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-red-800">Crisis Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-700">
              <div>
                <p className="font-semibold">National Suicide Prevention Lifeline</p>
                <p className="text-lg">Call or text: <a href="tel:988" className="text-red-600 font-bold">988</a></p>
              </div>
              <div>
                <p className="font-semibold">Crisis Text Line</p>
                <p>Text HOME to <span className="font-bold">741741</span></p>
              </div>
              <div>
                <p className="font-semibold">Emergency</p>
                <p className="text-lg">Call <a href="tel:911" className="text-red-600 font-bold">911</a></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResourceDirectory;
