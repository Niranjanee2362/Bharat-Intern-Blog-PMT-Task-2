import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { SendIcon } from "lucide-react";
import {
  collection,
  doc,
  getCountFromServer,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/backend/firebase";
import { useSession } from "next-auth/react";
import Image from "next/image";

const ProjectChat = ({ id }: any) => {
  const { data: session } = useSession();
  const [message, setMessage] = useState<string>("");
  const [chats, setChats] = useState<any>([]);
  const CHATS = [
    {
      id: 1,
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      isClient: true,
    },
    {
      id: 2,
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
      isClient: false,
    },
    {
      id: 3,
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      isClient: true,
    },
    {
      id: 4,
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
      isClient: false,
    },
  ];

  const getChatId = async () => {
    const initialVal = 23000001;
    const coll = collection(db, "projects", id, "chats");
    const snapshot = await getCountFromServer(coll);

    return `CC${initialVal + snapshot.data().count}`;
  };

  const handleSend = async () => {
    if (message) {
      const chatId = await getChatId();
      const docRef = doc(db, "projects", id, "chats", chatId);
      await setDoc(
        docRef,
        {
          message,
          sentAt: serverTimestamp(),
          sentBy: session?.user?.image,
          senderEmail: session?.user?.email,
        },
        { merge: true }
      );
      setMessage('')
      // alert("Task Added Successfully");
    } else {
      alert("Enter message to send");
    }
  };

  useEffect(() => {
    if (id) {
      const unsub = onSnapshot(
        collection(db, "projects", id, "chats"),
        (docs) => {
          const chats: any = [];
          docs.forEach((doc) => {
            chats.push({ ...doc.data(), id: doc.id });
          });
          setChats(chats);
        }
      );
      return () => unsub();
    }
  }, [id, message]);
  return (
    <div className="flex gap-4">
      <div className=" h-[600px] md:w-3/4 w-full ">
        <div className="flex flex-col flex-grow w-full h-full bg-app-grey-light shadow-xl rounded-lg overflow-hidden">
          <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
            {chats.map((chat: any) => (
              <div key={chat.id}>
                {chat.senderEmail != session?.user?.email ? (
                  <div className="flex w-full mt-2 space-x-3 max-w-sm">
                    <div>
                      <Image
                        alt="Photo"
                        width={100}
                        height={100}
                        src={chat.sentBy}
                        className="h-8 w-8 rounded-full"
                      />
                    </div>
                    <div className="p-3 bg-gray-600/50 rounded-r-lg rounded-bl-lg">
                      <p className="text-sm">{chat.message}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end ">
                    <div className="bg-app-slate-blue text-white p-3 rounded-l-lg rounded-br-lg">
                      <p className="text-sm">{chat.message}</p>
                    </div>
                    <div>
                      <Image
                        alt="Photo"
                        width={100}
                        height={100}
                        src={chat.sentBy}
                        className="h-8 w-8 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="bg-gray-500/50 p-4 flex items-center gap-2">
            <Input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              className="w-full"
              placeholder="Type a message"
            />
            <SendIcon strokeWidth={2} onClick={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectChat;
