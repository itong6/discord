import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getPool } from "../../db";

export default function Channel() {
  const router = useRouter();
  const { id } = router.query;
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    async function fetchChannel() {
      try {
        const pool = await getPool();
        const [result] = await pool.query("SELECT * FROM channels WHERE id = ?", [
          id,
        ]);
        if (result.length) {
          setChannel(result[0]);
        } else {
          setChannel(null);
        }
      } catch (err) {
        console.error("Error fetching channel:", err);
      }
    }
    if (id) {
      fetchChannel();
    }
  }, [id]);

  if (!channel) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{channel.name}</h1>
    </div>
  );
}