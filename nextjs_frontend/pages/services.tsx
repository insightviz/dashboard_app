import { Title, Flex, Loader } from '@mantine/core';

export default function Services() {
    return (
        <>
          <Title order={1} align="center">Nothing to see on the services page</Title>
          <Flex
            mih={200}
            justify="center"
            align="center"
            direction="column">
            <Loader variant="bars" size='md' />
          </Flex>
        </>
    );
}