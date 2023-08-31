import React from "react";
import dynamic from "next/dynamic";

const DynamicSeedButton = dynamic(() => import("./SeedButtonComp"), {
  loading: () => <p>Loading...</p>,
});

//* This component only shows on dev, it's meant not to manually load info on forms.

const SeedButton = ({ reset, mock }: { reset: any; mock: () => object }) => {
  const dev = process.env.NODE_ENV === "development";

  return <>{dev && <DynamicSeedButton reset={reset} mock={mock} />}</>;
};

export default SeedButton;
