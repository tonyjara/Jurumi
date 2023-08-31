import { Button } from "@chakra-ui/react";

const SeedButtonComp = ({ reset, mock }: { reset: any; mock: () => object }) => {

    return (
        <>
            <Button
                my={'10px'}
                onClick={() => {
                    reset(mock());
                }}
                colorScheme="purple"
            >
                Seed Me 🌱
            </Button>
        </>
    );
};

export default SeedButtonComp;
