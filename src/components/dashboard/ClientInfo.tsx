
import React from 'react';
import { User, Building2, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Client } from '@/types';

interface ClientInfoProps {
  client: Client;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ client }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <User className="h-5 w-5 mr-2 text-primary" />
          Client Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{client.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Building2 className="h-4 w-4 mr-2" />
              {client.company}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
          </div>
          
          <div>
            <span className="text-sm text-muted-foreground">Address</span>
            <p>{client.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfo;
