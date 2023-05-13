import PublishingForm from "@/components/PublishingForm";
import { useActiveProfile } from "@lens-protocol/react-web";

const PublishPage = () => {
  const { data } = useActiveProfile();

  return (
    <div className="p-4">
      {data ? <PublishingForm profile={data} /> : "No Lens profile"}
    </div>
  );
};

export default PublishPage;
