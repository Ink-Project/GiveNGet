import User from "../models/User";
import { Knex } from "knex";

export const seed = async (knex: Knex) => {
  // Before you have models you can always just do `await knex('table_name').del`
  await knex("users").del();
  await knex("posts").del();
  await knex("images").del();
  await knex("reservation").del();
  await knex("event_log").del();

  await knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE images_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE reservation_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE event_log_id_seq RESTART WITH 1");

  /// Insert fake users
  await User.create("cool_cat", "1234");
  await User.create("l33t-guy", "1234");
  await User.create("wowow", "1234");

    // Insert fake posts
    await knex('posts').insert([
      { title: 'First Post', desc: 'This is my first post. Here is a PS5 if anyone needs it', location: 'New York', user_id: 1 },
      { title: 'Second Post', desc: 'I am a software developer. I need to sell this laptop', location: 'Los Angeles', user_id: 2 },
      { title: 'Third Post', desc: 'How do you knw youre not in the matrix!?!? #StayWoke. Also here a gift if anyone wants it', location: 'Los Angeles', user_id: 2 }
    ]);
  
      // Insert fake images
  await knex('images').insert([
    { url: 'https://cdn.mos.cms.futurecdn.net/HkdMToxijoHfz4JwUgfh3G.jpg', post_id: 1 },
    { url: 'https://cdn.britannica.com/77/170477-050-1C747EE3/Laptop-computer.jpg', post_id: 2 },
    { url: 'https://cdn.thewirecutter.com/wp-content/media/2023/05/sofabuyingguide-2048px-benchmademoderncream.jpg?auto=webp&quality=75&width=1024', post_id: 3}
  ]);

    // Insert fake reservations
    await knex('reservation').insert([
      { pickup_time: new Date(), user_id: 1, post_id: 1 },
      { pickup_time: new Date(), user_id: 2, post_id: 2 },
    ]);
  
    // Insert fake event logs
    await knex('event_log').insert([
      { event: 'reserved', actor_id: 1, post_id: 1 },
      { event: 'created', actor_id: 2, post_id: 2 },
    ]);
};