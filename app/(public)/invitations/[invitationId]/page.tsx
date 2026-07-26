import { InvitationAcceptancePage } from "./components/InvitationAcceptancePage";

type InvitationPageProps = {
  params: Promise<{
    invitationId: string;
  }>;
};

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { invitationId } = await params;

  return <InvitationAcceptancePage invitationId={invitationId} />;
}
