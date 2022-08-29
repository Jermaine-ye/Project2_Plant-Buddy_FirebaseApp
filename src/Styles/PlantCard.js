import {
  createStyles,
  Card,
  Image,
  Avatar,
  Text,
  Group,
  Box,
} from "@mantine/core";
import { isAfter, isBefore, isSameDay, parseISO } from "date-fns";
import { DropletFilled2 } from "tabler-icons-react";

const useStyles = createStyles((theme) => {
  return {
    card: {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    },

    title: {
      fontWeight: 700,
      fontFamily: theme.headings.fontFamily,
      marginBottom: 0,
    },

    body: {
      padding: theme.spacing.xs,
      textAlign: "left",
    },
  };
});

export function ArticleCardVertical({
  image,
  plantFamily,
  plantName,
  dateAdded,
  dateLastWatered,
  dateLastWateredCheck,
  sunlightReq,
  handleBoxClick,
  waterPlant,
}) {
  const { classes } = useStyles();
  return (
    <Card
      onClick={() => {
        console.log("Open Info");
      }}
      withBorder
      radius="md"
      p={0}
      className={(classes.card, `plantcard-row`)}
    >
      <Box onClick={handleBoxClick}>
        <Group noWrap spacing={0}>
          <Image
            onClick={() => console.log("pressed")}
            src={image}
            height={140}
            width={140}
          />

          <div className={classes.body}>
            <Group noWrap spacing="xs" position="apart" grow>
              <Text className={classes.title} mt="xs" mb="md">
                {plantName}
              </Text>
            </Group>
            <Text transform="uppercase" color="dimmed" weight={700} size="xs">
              {plantFamily}
            </Text>

            <Group noWrap spacing="xs">
              <Group spacing="xs" noWrap>
                <img
                  alt="watering-can"
                  src="https://img.icons8.com/carbon-copy/30/000000/watering-can.png"
                />
                <Text size="xs">
                  Last Watered: <br />
                  {dateLastWateredCheck ? dateLastWateredCheck : "To Water"}
                </Text>
              </Group>
            </Group>
            <Text size="xs" color="dimmed">
              Date Added: {dateAdded}
            </Text>
          </div>
        </Group>
      </Box>
      {!isBefore(parseISO(dateLastWatered), new Date()) ? (
        <DropletFilled2
          className="plantcard-water-button"
          onClick={() => waterPlant()}
        />
      ) : null}
    </Card>
  );
}
