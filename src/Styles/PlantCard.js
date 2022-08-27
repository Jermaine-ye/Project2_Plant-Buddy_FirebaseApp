import { createStyles, Card, Image, Avatar, Text, Group } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => {
  const image = getRef("image");

  return {
    card: {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,

      [`&:hover .${image}`]: {
        transform: "scale(1.03)",
      },
    },

    title: {
      fontWeight: 700,
      fontFamily: theme.headings.fontFamily,
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
  sunlightReq,
}) {
  const { classes } = useStyles();
  return (
    <Card withBorder radius="md" p={0} className={classes.card}>
      <Group noWrap spacing={0}>
        <Image
          onClick={() => console.log("pressed")}
          src={image}
          height={140}
          width={140}
        />

        <div className={classes.body}>
          <Text className={classes.title} mt="xs" mb="md">
            {plantName}
          </Text>
          <Text transform="uppercase" color="dimmed" weight={700} size="xs">
            {plantFamily}
          </Text>

          <Group noWrap spacing="xs">
            <Group spacing="xs" noWrap>
              <img
                alt="watering-can"
                src="https://img.icons8.com/carbon-copy/30/000000/watering-can.png"
              />
              <Text size="xs">Last Watered: {dateLastWatered}</Text>
            </Group>
          </Group>
          <Text size="xs" color="dimmed">
            Date Added: {dateAdded}
          </Text>
        </div>
      </Group>
    </Card>
  );
}
