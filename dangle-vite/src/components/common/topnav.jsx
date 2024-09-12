import { RefreshSessionButton } from "@/components/common/buttons";
export default function TopNav() {
  const logoPath = `dango.svg`;

  return (
    <div className="sticky top-0 z-10 bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-8 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img
                className="h-6 w-auto transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                src={logoPath}
                alt="Workflow"
              />
              <span className="ml-3 font-bold text-gray-700">Dango</span>
            </a>
          </div>
          <div className="flex-grow"></div>
          <div className="flex items-center">
            <RefreshSessionButton
              onClick={() => {
                location.reload();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
