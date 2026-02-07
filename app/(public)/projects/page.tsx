import PublicProjectList from '@/components/public/project-page/PublicProjectList'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Portfolio | Interior Design Projects | Casa Chic Interior',
  description: 'Explore our award-winning interior design projects ranging from modern residential homes to premium commercial workspaces.',
};

export default function PublicProjectListServer() {
  return (
    <div>
      <PublicProjectList/>
    </div>
  )
}
