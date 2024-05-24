import { Event, Post, Reservation, User } from "../../models";

export const seed = async () => {
  await Event.deleteAll();
  await Reservation.deleteAll();
  await Post.deleteAll();
  await User.deleteAll();

  const cool_cat = (await User.create("cool_cat", "1234", "Chris Lopez"))!;
  const leet_guy = (await User.create("l33t-guy", "1234", "Michael Perez"))!;
  const wowow = (await User.create("wowow", "1234", "John Doe"))!;
  const cool_cucumber = (await User.create("cool_cucumber", "1234", "Alice Johnson"))!;
  const cozy_kitty = (await User.create("cozy_kitty", "1234", "Allison Johnson"))!;
  const artsy_anna = (await User.create("artsy_anna", "1234", "Anna Rodriguez"))!;
  const garden_guru = (await User.create("garden_guru", "1234", "Samantha Green"))!;
  const crafty_chef = (await User.create("crafty_chef", "1234", "Emily Baker"))!;
  const musical_melody = (await User.create("musical_melody", "1234", "Michael Turner"))!;
  const green_thumb = (await User.create("green_thumb", "1234", "Olivia Martinez"))!;
  const tech_enthusiast = (await User.create("tech_enthusiast", "1234", "David Nguyen"))!;
  const cozy_home = (await User.create("cozy_home", "1234", "Sophia King"))!;
  const creative_crafter = (await User.create("creative_crafter", "1234", "Emma Watson"))!;
  const cozy_corner = (await User.create("cozy_corner", "1234", "Liam Harris"))!;
  const plant_lover = (await User.create("plant_lover", "1234", "Ava Miller"))!;
  const gadget_guru = (await User.create("gadget_guru", "1234", "Noah Wilson"))!;
  const fashionista = (await User.create("fashionista", "1234", "Sophie Taylor"))!;
  const crafty_crafter = (await User.create("crafty_crafter", "1234", "Emily Davis"))!;
  const handy_hiker = (await User.create("handy_hiker", "1234", "Noah Wilson"))!;
  const pet_lover = (await User.create("pet_lover", "1234", "Oliver Martinez"))!;
  const creative_chef = (await User.create("creative_chef", "1234", "Ella Thompson"))!;
  const artistic_soul = (await User.create("artistic_soul", "1234", "Grace Parker"))!;
  const home_chef = (await User.create("home_chef", "1234", "Daniel Taylor"))!;

  const first = await Post.create(
    cool_cat.id,
    "PS5",
    "This is my first post. Here is a PS5 if anyone needs it",
    "Brooklyn",
    [
      "https://cdn.mos.cms.futurecdn.net/HkdMToxijoHfz4JwUgfh3G.jpg",
      "https://images.pushsquare.com/af8bd4f21bd6c/ps5-photo.large.jpg",
      "https://awsimages.detik.net.id/community/media/visual/2020/09/24/ps5.jpeg?w=600&q=90",
    ],
    [new Date(2024, 5, 1, 9, 15, 30)],
  );

  await Post.create(
    cool_cat.id,
    "Laptop",
    "I am a software developer who no longer needs this laptop",
    "Brooklyn",
    [
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6550/6550428_sd.jpg",
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6550/6550428ld.jpg",
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6550/6550428cv7d.jpg",
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6550/6550428cv10d.jpg",
    ],
    [
      new Date(2024, 5, 2, 11, 25, 40),
      new Date(2024, 5, 3, 14, 35, 50),
      new Date(2024, 5, 4, 16, 45, 10),
    ],
  );

  await Post.create(
    cool_cat.id,
    "Tan Couch",
    "How do you know youre not in the matrix!?!? #StayWoke. Also here a gift if anyone wants it",
    "Brooklyn",
    [
      "https://cdn.thewirecutter.com/wp-content/media/2023/05/sofabuyingguide-2048px-benchmademoderncream.jpg?auto=webp&quality=75&width=1024",
    ],
    [new Date(2024, 5, 5, 18, 55, 20), new Date(2024, 5, 6, 20, 5, 30)],
  );

  await Post.create(
    cool_cucumber.id,
    "Vintage Record Player",
    "A vintage record player in good working condition. It has a wooden finish and comes with a set of speakers. Perfect for those who love collecting vinyl records.",
    "123 Main Street, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/5jsAAOSw~cthNUpY/s-l1600.webp",
      "https://i.ebayimg.com/images/g/Ka0AAOSwc4dhNUqD/s-l1600.webp",
      "https://i.ebayimg.com/images/g/NMMAAOSwIbZhNUpa/s-l1600.webp",
      "https://i.ebayimg.com/images/g/te0AAOSwMO9hNUpb/s-l1600.webp",
    ],
    [new Date(2024, 5, 7, 22, 15, 40), new Date(2024, 5, 8, 23, 25, 50)],
  );

  await Post.create(
    cozy_kitty.id,
    "Cozy Knit Blanket",
    "Hand-knitted cozy blanket made from soft wool. Perfect for keeping warm during chilly evenings. The colors are earthy and blend well with any home decor.",
    "456 Elm Avenue, Brooklyn, NY",
    ["https://i.ebayimg.com/images/g/l1MAAOSwN3FmQV1j/s-l1600.webp"],
    [new Date(2024, 5, 9, 8, 35, 0), new Date(2024, 5, 10, 10, 45, 10)],
  );

  await Post.create(
    artsy_anna.id,
    "Art Supplies Bundle",
    "Bundle of assorted art supplies including paintbrushes, acrylic paints, canvases, and sketchbooks. Ideal for artists of all skill levels looking to explore their creativity.",
    "789 Oak Street, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/1DAAAOSwewpmTlfz/s-l1600.webp",
      "https://i.ebayimg.com/images/g/FvIAAOSwlTVmTlf3/s-l1600.webp",
      "https://i.ebayimg.com/images/g/XEcAAOSw1~5mTlf9/s-l1600.webp",
      "https://i.ebayimg.com/images/g/JTAAAOSwT5JmTlgZ/s-l1600.webp",
    ],
    [new Date(2024, 5, 25, 21, 15, 40), new Date(2024, 5, 26, 23, 25, 50)],
  );

  await Post.create(
    garden_guru.id,
    "Potted Succulent Plants",
    "Assortment of potted succulent plants including various species such as Echeveria, Haworthia, and Aloe Vera. Low-maintenance plants perfect for adding a touch of greenery to any space.",
    "202 Pine Street, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/2ecAAOSwj9VmTkqR/s-l1600.webp",
      "https://i.ebayimg.com/images/g/6v8AAOSwl21mTkqR/s-l1600.webp",
      "https://i.ebayimg.com/images/g/99cAAOSwNcBmTkqT/s-l1600.webp",
      "https://i.ebayimg.com/images/g/dTUAAOSwOTZmTkqS/s-l1600.webp",
    ],
    [new Date(2024, 5, 23, 17, 55, 20), new Date(2024, 5, 24, 19, 5, 30)],
  );

  await Post.create(
    crafty_chef.id,
    "Handmade Ceramic Plates",
    "Set of six handmade ceramic plates in assorted colors. Each plate is unique and adds a touch of artisanal charm to your dining experience.",
    "303 Elm Street, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/qx4AAOSw7K5kqx0H/s-l1600.webp",
      "https://i.ebayimg.com/images/g/2e4AAOSwKSZkqx0W/s-l1600.webp",
      "https://i.ebayimg.com/images/g/q98AAOSw8Q5kqx0c/s-l1600.webp",
      "https://i.ebayimg.com/images/g/mzcAAOSwvtVkqx0f/s-l1600.webp",
    ],
    [new Date(2024, 5, 21, 13, 35, 0), new Date(2024, 5, 22, 15, 45, 10)],
  );

  await Post.create(
    musical_melody.id,
    "Acoustic Guitar",
    "Well-loved acoustic guitar in good condition. Perfect for beginners or those looking to practice their musical skills. Comes with a carrying case.",
    "404 Maple Avenue, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/MDEAAOSwGldmRWZG/s-l1600.webp",
      "https://i.ebayimg.com/images/g/YmgAAOSwtWlmRWZG/s-l1600.webp",
      "https://i.ebayimg.com/images/g/nCsAAOSwI9tmRWZM/s-l1600.webp",
      "https://i.ebayimg.com/images/g/lC4AAOSwfK1mRWZG/s-l1600.webp",
    ],
    [new Date(2024, 5, 19, 9, 15, 40), new Date(2024, 5, 20, 11, 25, 50)],
  );

  await Post.create(
    green_thumb.id,
    "Assorted Houseplants",
    "Collection of healthy houseplants including Snake Plant, Peace Lily, and Spider Plant. Thriving in various conditions, these plants are perfect for indoor gardening enthusiasts.",
    "505 Oak Lane, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/e2sAAOSwaZNkWEbP/s-l1600.webp",
      "https://i.ebayimg.com/images/g/jRQAAOSwtYtkWEbQ/s-l1600.webp",
      "https://i.ebayimg.com/images/g/SQYAAOSwzUdkdre7/s-l1600.webp",
    ],
    [new Date(2024, 5, 17, 23, 55, 20), new Date(2024, 5, 18, 7, 5, 30)],
  );

  await Post.create(
    tech_enthusiast.id,
    "Wireless Bluetooth Headphones",
    "Sleek and modern wireless Bluetooth headphones in excellent condition. Provides clear sound quality and comfortable wear for extended listening sessions.",
    "606 Pine Street, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/Wx4AAOSw1B9hltMJ/s-l1600.webp",
      "https://i.ebayimg.com/images/g/90cAAOSwgAVhltL9/s-l1600.webp",
      "https://i.ebayimg.com/images/g/y-UAAOSwaIRhltL-/s-l1600.webp",
      "https://i.ebayimg.com/images/g/jCoAAOSw0AphltL~/s-l1600.webp",
    ],
    [new Date(2024, 5, 15, 20, 35, 0), new Date(2024, 5, 16, 22, 45, 10)],
  );

  await Post.create(
    cozy_home.id,
    "Handcrafted Throw Pillows",
    "Set of decorative throw pillows handcrafted from soft fabrics. Each pillow features unique patterns and textures, adding a cozy touch to any living space.",
    "707 Elm Street, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/diUAAOSwk4RmB3K3/s-l1600.webp",
      "https://i.ebayimg.com/images/g/BEAAAOSwih9mB3K4/s-l1600.webp",
      "https://i.ebayimg.com/images/g/id0AAOSwYuNmB3K4/s-l1600.webp",
      "https://i.ebayimg.com/images/g/IH8AAOSw9tJmB3K5/s-l1600.webp",
    ],
    [new Date(2024, 5, 13, 16, 15, 40), new Date(2024, 5, 14, 18, 25, 50)],
  );
  await Post.create(
    creative_crafter.id,
    "Handmade Macrame Wall Hanging",
    "Beautiful handmade macrame wall hanging crafted with natural cotton rope. Adds a bohemian touch to any room and makes for a stunning statement piece.",
    "808 Oak Lane, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/VBkAAOSw2CNf0FuH/s-l1600.webp",
      "https://i.ebayimg.com/images/g/0MUAAOSwum1f0FuF/s-l1600.webp",
    ],
    [
      new Date(2024, 4, 23, 11, 4, 50),
      new Date(2024, 5, 14, 14, 15, 30),
      new Date(2024, 6, 20, 9, 45, 15),
    ],
  );

  await Post.create(
    cozy_corner.id,
    "Fluffy Faux Fur Rug",
    "Large fluffy faux fur rug in excellent condition. Adds warmth and texture to any room, perfect for creating a cozy corner to relax and unwind.",
    "909 Pine Street, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/vzoAAOSwGhRbpB~P/s-l1600.webp",
      "https://i.ebayimg.com/images/g/xboAAOSwszVbpB-U/s-l1600.webp",
      "https://i.ebayimg.com/images/g/Z7sAAOSwdbVbpB-q/s-l1600.webp",
      "https://i.ebayimg.com/images/g/i8MAAOSwNwdbpB-~/s-l1600.webp",
    ],
    [
      new Date(2024, 8, 28, 21, 55, 30),
      new Date(2024, 5, 20, 12, 45, 55),
      new Date(2024, 6, 10, 6, 20, 40),
    ],
  );

  await Post.create(
    plant_lover.id,
    "Set of Succulent Cuttings",
    "Assortment of healthy succulent cuttings ready for propagation. Includes various species and colors, perfect for indoor gardening enthusiasts or succulent collectors.",
    "1010 Elm Street, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/ytwAAOSwDA5mPVA8/s-l1600.webp",
      "https://i.ebayimg.com/images/g/58QAAOSwvtZmPVA8/s-l1600.webp",
      "https://i.ebayimg.com/images/g/BMUAAOSwr6RmPVA8/s-l1600.webp",
    ],
    [
      new Date(2024, 7, 30, 8, 5, 10),
      new Date(2024, 8, 8, 13, 15, 45),
      new Date(2024, 8, 18, 17, 35, 5),
    ],
  );

  await Post.create(
    gadget_guru.id,
    "Smart Home Security Camera",
    "High-definition smart home security camera with motion detection and night vision capabilities. Easily monitor your home remotely via a smartphone app.",
    "1111 Maple Avenue, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/ZV8AAOSwT5NlvFZW/s-l1600.webp",
      "https://i.ebayimg.com/images/g/k3wAAOSwurVlvFZX/s-l1600.webp",
    ],
    [
      new Date(2024, 7, 3, 11, 40, 50),
      new Date(2024, 7, 13, 15, 25, 35),
      new Date(2024, 7, 23, 19, 50, 20),
    ],
  );

  await Post.create(
    fashionista.id,
    "Designer Handbag",
    "Stylish designer handbag in like-new condition. Crafted from high-quality materials with meticulous attention to detail. Elevate your outfit with this chic accessory.",
    "1212 Oak Lane, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/8wgAAOSwwXZmP8Bn/s-l1600.webp",
      "https://i.ebayimg.com/images/g/BvIAAOSwwnRmP8Bn/s-l1600.webp",
      "https://i.ebayimg.com/images/g/xiIAAOSwNNJmP8Bn/s-l1600.webp",
      "https://i.ebayimg.com/images/g/rQ4AAOSwAlFmP8Bn/s-l1600.webp",
    ],
    [
      new Date(2024, 6, 4, 9, 30, 40),
      new Date(2024, 6, 14, 16, 55, 25),
      new Date(2024, 6, 24, 20, 10, 15),
    ],
  );
  await Post.create(
    crafty_crafter.id,
    "Handmade Knit Scarf",
    "Beautiful handmade knit scarf in a variety of colors. Perfect for keeping warm during the winter months or adding a pop of color to your outfit.",
    "123 Elm Street, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/TAIAAOSw1VxmRvE1/s-l1600.webp",
      "https://i.ebayimg.com/images/g/ha8AAOSwd75mRvE9/s-l1600.webp",
      "https://i.ebayimg.com/images/g/oaoAAOSwpAhmRvEy/s-l1600.webp",
    ],
    [
      new Date(2024, 5, 5, 10, 20, 30),
      new Date(2024, 5, 15, 14, 45, 50),
      new Date(2024, 5, 25, 18, 5, 10),
    ],
  );

  await Post.create(
    handy_hiker.id,
    "Camping Backpack",
    "Durable camping backpack with multiple compartments and padded straps for comfort. Ideal for hiking trips or outdoor adventures.",
    "456 Maple Avenue, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/uUgAAOSwvQFmS~WD/s-l1600.webp",
      "https://i.ebayimg.com/images/g/AmUAAOSws31mS~WE/s-l1600.webp",
      "https://i.ebayimg.com/images/g/pkMAAOSwOTZmS~WE/s-l1600.webp",
    ],
    [
      new Date(2025, 4, 20, 19, 5, 40),
      new Date(2025, 5, 11, 5, 15, 55),
      new Date(2025, 6, 24, 22, 25, 10),
    ],
  );

  await Post.create(
    pet_lover.id,
    "Dog Grooming Clippers",
    "Professional-grade dog grooming clippers with adjustable blades and ergonomic design. Keep your pet looking neat and tidy with this essential grooming tool.",
    "101 Oak Lane, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/oDYAAOSw-KlmIqDa/s-l1600.webp",
      "https://i.ebayimg.com/images/g/Ra0AAOSwtsRmIqDb/s-l1600.webp",
      "https://i.ebayimg.com/images/g/-WEAAOSwKaZmIqDc/s-l1600.webp",
    ],
    [
      new Date(2025, 1, 10, 17, 35, 50),
      new Date(2025, 2, 23, 12, 45, 5),
      new Date(2025, 3, 28, 15, 55, 25),
    ],
  );

  await Post.create(
    creative_chef.id,
    "Cookbook Collection",
    "Assorted collection of cookbooks featuring recipes from around the world. From Italian pasta dishes to Japanese sushi, explore the culinary delights of different cultures.",
    "789 Elm Street, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/SkoAAOSwR1VmTp3L/s-l1600.webp",
      "https://i.ebayimg.com/images/g/kzQAAOSwI0xmTp4R/s-l1600.webp",
      "https://i.ebayimg.com/images/g/ZfQAAOSw1GZmTp4S/s-l1600.webp",
      "https://i.ebayimg.com/images/g/J9oAAOSwBFJmTp4Z/s-l1600.webp",
    ],
    [new Date(2024, 5, 3, 14, 35, 50)],
  );

  await Post.create(
    artistic_soul.id,
    "Watercolor Paint Set",
    "Complete watercolor paint set with a variety of vibrant colors and high-quality brushes. Whether you're a beginner or an experienced artist, unleash your creativity with this versatile paint set.",
    "101 Pine Lane, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/qWkAAOSw0shmS5vl/s-l1600.webp",
      "https://i.ebayimg.com/images/g/zjYAAOSw-IhmS5vH/s-l1600.webp",
      "https://i.ebayimg.com/images/g/4nIAAOSwbQVmS5vF/s-l1600.webp",
    ],
    [
      new Date(2024, 7, 25, 18, 20, 45),
      new Date(2024, 8, 30, 7, 30, 0),
      new Date(2024, 9, 29, 21, 50, 10),
    ],
  );

  await Post.create(
    home_chef.id,
    "Kitchen Knife Set",
    "Professional-grade kitchen knife set featuring high-quality stainless steel blades and ergonomic handles. Includes a variety of knives for all your culinary needs.",
    "202 Maple Street, Brooklyn, NY",
    [
      "https://i.ebayimg.com/images/g/~KoAAOSwRqhl6Au7/s-l1600.webp",
      "https://i.ebayimg.com/images/g/x10AAOSw8~dl6AvF/s-l1600.webp",
      "https://i.ebayimg.com/images/g/qlMAAOSwpVhl6AvI/s-l1600.webp",
    ],
    [new Date(2024, 5, 11, 12, 55, 20), new Date(2024, 5, 12, 14, 5, 30)],
  );

  let [rev] = await Reservation.byPost(first!.id);
  rev = (await Reservation.select(rev, first!.user_id, leet_guy.id))!;
  rev = (await Reservation.cancel(rev, first!.user_id, leet_guy.id))!;
  await Reservation.select(rev!, first!.user_id, wowow.id);
};
