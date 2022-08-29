import { useState } from "react";
import { IconPlus } from "@tabler/icons";
import {
  Card,
  Text,
  Group,
  createStyles,
  Button,
  Modal,
  Accordion,
  Title,
} from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => {
  const image = getRef("image");

  return {
    card: {
      position: "relative",
      height: 280,
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],

      [`&:hover .${image}`]: {
        transform: "scale(1.03)",
      },
    },

    image: {
      ref: image,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: "cover",
      transition: "transform 500ms ease",
    },

    overlay: {
      position: "absolute",
      top: "20%",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage:
        "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 50%)",
    },

    content: {
      height: "100%",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      zIndex: 1,
    },

    title: {
      color: theme.white,
      marginBottom: 5,
      fontFamily: "Poppins",
      fontWeight: "700",
    },

    bodyText: {
      color: theme.colors.dark[2],
      marginLeft: 7,
    },

    author: {
      color: theme.colors.dark[0],
    },
  };
});

// interface ImageCardProps {
//   link: string;
//   image: string;
//   title: string;
//   author: string;
//   views: number;
//   comments: number;
// }

export function NewPlantCard({
  image,
  plantFamily,
  description,
  link,
  plantInfo,
}) {
  const { classes, theme } = useStyles();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Card
        p="lg"
        shadow="lg"
        className={classes.card}
        radius="md"
        // component="a"
        // href={link}
        // target="_blank"
      >
        <div
          className={classes.image}
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className={classes.overlay} />

        <div className={classes.content}>
          <div>
            <Text size="lg" className={classes.title} weight={500}>
              <Button onClick={() => setOpened(true)}>{plantFamily}</Button>
            </Text>

            <Group position="apart" spacing="xs">
              <Text size="sm" className={classes.author}>
                {description}
              </Text>
            </Group>
          </div>
        </div>
      </Card>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={3}>{plantFamily}</Title>}
        padding="xl"
        size="95%"
        position="bottom"
        style={{ color: "seashell" }}
        overflow="inside"
        padding="xs"
      >
        <Accordion
          defaultValue="Light & Temperature"
          chevron={<IconPlus size={16} />}
          styles={{
            chevron: {
              "&[data-rotate]": {
                transform: "rotate(45deg)",
              },
            },
          }}
        >
          <Accordion.Item value="Light & Temperature">
            <Accordion.Control>Light & Temperature</Accordion.Control>
            <Accordion.Panel>
              {plantInfo["Light & Temperature"]}
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="Watering, Humidity & Misting">
            <Accordion.Control>Watering, Humidity & Misting</Accordion.Control>
            <Accordion.Panel>
              {plantInfo["Watering, Humidity & Misting"]}
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="Soil and Repotting">
            <Accordion.Control>Soil and Repotting</Accordion.Control>
            <Accordion.Panel>{plantInfo["Soil and Repotting"]}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="Propagation">
            <Accordion.Control>Propagation</Accordion.Control>
            <Accordion.Panel>{plantInfo["Propagation"]}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="Fertiliser">
            <Accordion.Control>Fertiliser</Accordion.Control>
            <Accordion.Panel>{plantInfo["Fertiliser"]}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="Toxicity">
            <Accordion.Control>Toxicity</Accordion.Control>
            <Accordion.Panel>{plantInfo["Toxicity"]}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="Possible Issues">
            <Accordion.Control>Possible Issues</Accordion.Control>
            <Accordion.Panel>{plantInfo["Possible Issues"]}</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Modal>
    </>
  );
}
