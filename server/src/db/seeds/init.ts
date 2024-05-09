import Event from "../../models/Event";
import Post from "../../models/Post";
import Reservation from "../../models/Reservation";
import User from "../../models/User";

export const seed = async () => {
  await Event.deleteAll();
  await Reservation.deleteAll();
  await Post.deleteAll();
  await User.deleteAll();

  const cool_cat = (await User.create("cool_cat", "1234"))!;
  const leet_guy = (await User.create("l33t-guy", "1234"))!;
  const wowow = (await User.create("wowow", "1234"))!;

  const first = await Post.create(
    cool_cat.data.id,
    "First Post",
    "This is my first post. Here is a PS5 if anyone needs it",
    "New York",
    ["https://cdn.mos.cms.futurecdn.net/HkdMToxijoHfz4JwUgfh3G.jpg"],
    [new Date()]
  );

  await Post.create(
    cool_cat.data.id,
    "Second Post",
    "I am a software developer. I need to sell this laptop",
    "Los Angeles",
    ["https://cdn.britannica.com/77/170477-050-1C747EE3/Laptop-computer.jpg"],
    [new Date()]
  );

  await Post.create(
    cool_cat.data.id,
    "Third Post",
    "How do you knw youre not in the matrix!?!? #StayWoke. Also here a gift if anyone wants it",
    "Los Angeles",
    [
      "https://cdn.thewirecutter.com/wp-content/media/2023/05/sofabuyingguide-2048px-benchmademoderncream.jpg?auto=webp&quality=75&width=1024",
    ],
    [new Date()]
  );

  let [rev] = await Reservation.byPost(first.data.id);
  rev = (await rev.reserve(leet_guy.data.id))!;
  rev = (await rev.cancel(leet_guy.data.id))!;
  rev = (await rev.reserve(wowow.data.id))!;
};
