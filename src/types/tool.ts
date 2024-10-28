import { ComponentType } from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  component: ComponentType;
}