import * as Event from "../../models/Event";
import * as Post from "../../models/Post";
import * as Reservation from "../../models/Reservation";
import * as User from "../../models/User";

export const seed = async () => {
  await Event.deleteAll();
  await Reservation.deleteAll();
  await Post.deleteAll();
  await User.deleteAll();

  const cool_cat = (await User.create("cool_cat", "1234"))!;
  const leet_guy = (await User.create("l33t-guy", "1234"))!;
  const wowow = (await User.create("wowow", "1234"))!;

  const first = await Post.create(
    cool_cat.id,
    "First Post",
    "This is my first post. Here is a PS5 if anyone needs it",
    "Brooklyn",
    [
      "https://cdn.mos.cms.futurecdn.net/HkdMToxijoHfz4JwUgfh3G.jpg",
      "https://images.pushsquare.com/af8bd4f21bd6c/ps5-photo.large.jpg",
      "https://awsimages.detik.net.id/community/media/visual/2020/09/24/ps5.jpeg?w=600&q=90",
    ],
    [new Date()]
  );

  await Post.create(
    cool_cat.id,
    "Second Post",
    "I am a software developer who no longer needs this laptop",
    "Brooklyn",
    [
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6550/6550428_sd.jpg",
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6550/6550428ld.jpg",
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6550/6550428cv7d.jpg",
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6550/6550428cv10d.jpg",
    ],
    [new Date(), new Date(), new Date()]
  );

  await Post.create(
    cool_cat.id,
    "Third Post",
    "How do you know youre not in the matrix!?!? #StayWoke. Also here a gift if anyone wants it",
    "Brooklyn",
    [
      "https://cdn.thewirecutter.com/wp-content/media/2023/05/sofabuyingguide-2048px-benchmademoderncream.jpg?auto=webp&quality=75&width=1024",
    ],
    [new Date(), new Date(), new Date()]
  );

  let [rev] = await Reservation.byPost(first!.id);
  rev = await Reservation.select(rev!, first!.user_id, leet_guy.id);
  rev = await Reservation.cancel(rev!, first!.user_id, leet_guy.id);
  await Reservation.select(rev!, first!.user_id, wowow.id);
};
