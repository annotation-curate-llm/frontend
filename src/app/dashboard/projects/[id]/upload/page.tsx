import { UploadAssetsPage } from '@/components/projects/upload-assets-page';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <UploadAssetsPage projectId={id} />;
}