import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import DefinitionGroup from "../components/DefinitionGroup";

const VocabMountain = () => {
  const [user, setUser] = useState(null);
  const [vocabList, setVocabList] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const getVocab = async () => {
    try {
      const q = query(
        collection(db, "vocab"),
        where("uid", "==", user),
        orderBy("timestamp", "desc")
      );
      const querySnapShot = await getDocs(q);
      const fetchData = [];
      querySnapShot.forEach((doc) => {
        fetchData.push({ id: doc.id, ...doc.data() });
      });
      setVocabList(fetchData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(uid);
      } else {
        setUser(null);
      }
    });
  }, [user]);

  useEffect(() => {
    getVocab();
  }, [user]);

  if (isLoading) return null;

  return (
    <main>
      <nav className="p-2">
        <div>
          <Link to={"/"}>Home</Link>
        </div>
      </nav>
      <div>
        <h1>Vocab Mountain</h1>
      </div>
      <div className="flex flex-col gap-4">
        {vocabList?.map((vocab, index) => {
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

export default VocabMountain;
