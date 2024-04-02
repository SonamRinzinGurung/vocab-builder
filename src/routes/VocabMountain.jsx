import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase-config";
import DefinitionGroup from "../components/DefinitionGroup";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

const VocabMountain = ({ user }) => {
  const {
    error,
    data,
    isPending,
    isLoading: isQueryLoading,
  } = useQuery({
    queryKey: ["vocab-mountain"],
    queryFn: async () => {
      const q = query(
        collection(db, "vocab"),
        where("uid", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const querySnapShot = await getDocs(q);
      const fetchData = [];
      querySnapShot.forEach((doc) => {
        fetchData.push({ id: doc.id, ...doc.data() });
      });
      return fetchData;
    },
  });

  if (error) return "An error has occurred: " + error.message;

  if (isPending || isQueryLoading) return <div>Loading...</div>;

  return (
    <main>
      <div className="flex flex-col gap-4 ml-4">
        <div>
          <h1>Vocab Mountain</h1>
        </div>
        {data?.map((vocab, index) => {
          return (
            <section key={index} className="">
              <DefinitionGroup vocab={vocab} />
            </section>
          );
        })}
      </div>
    </main>
  );
};

VocabMountain.propTypes = {
  user: PropTypes.object.isRequired,
};
export default VocabMountain;
