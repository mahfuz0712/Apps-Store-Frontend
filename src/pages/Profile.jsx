import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);

  // Retrieve user details from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Default fallback for user details
  const defaultUser = {
    name: "John Doe",
    firstName: "John",
    lastName: "Doe",
    dob: "01/01/2000",
    gender: "Male",
    location: "Unknown",
    phone: "+0000000000",
    email: "example@example.com",
    website: "#",
  };

  const currentUser = user || defaultUser;

  return (
    <div className="w-full overflow-hidden dark:bg-gray-900">
      <div className="flex flex-col">
        {/* Cover Image */}
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw5fHxjb3ZlcnxlbnwwfDB8fHwxNzEwNzQxNzY0fDA&ixlib=rb-4.0.3&q=80&w=1080"
          alt="User Cover"
          className="w-full xl:h-[40rem] lg:h-[36rem] md:h-[32rem] sm:h-[28rem] xs:h-[24rem]"
        />

        {/* Profile Image */}
        <div className="sm:w-[80%] xs:w-[90%] mx-auto flex">
          <img
            src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw3fHxwZW9wbGV8ZW58MHwwfHx8MTcxMTExMTM4N3ww&ixlib=rb-4.0.3&q=80&w=1080"
            alt="User Profile"
            className="rounded-md lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-blue-500 relative lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]"
          />

          {/* Full Name */}
          <h1 className="w-full text-left my-4 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif">
            {currentUser.name}
          </h1>
        </div>

        <div className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
          {/* Description */}
          <p className="w-fit text-gray-700 dark:text-gray-400 text-md text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            debitis labore consectetur voluptatibus mollitia dolorem veniam
            omnis ut quibusdam minima sapiente repellendus asperiores explicabo.
          </p>

          {/* Details */}
          <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
            <div className="w-full flex sm:flex-row xs:flex-col gap-2 justify-center">
              {/* Left Column */}
              <div className="w-full">
                <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                  <div className="flex flex-col pb-3">
                    <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                      First Name
                    </dt>
                    <dd className="text-lg font-semibold">
                      {currentUser.firstName}
                    </dd>
                  </div>
                  <div className="flex flex-col py-3">
                    <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                      Last Name
                    </dt>
                    <dd className="text-lg font-semibold">
                      {currentUser.lastName}
                    </dd>
                  </div>
                  <div className="flex flex-col py-3">
                    <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                      Date Of Birth
                    </dt>
                    <dd className="text-lg font-semibold">
                      {currentUser.dob}
                    </dd>
                  </div>
                  <div className="flex flex-col py-3">
                    <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                      Gender
                    </dt>
                    <dd className="text-lg font-semibold">
                      {currentUser.gender}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Right Column */}
              <div className="w-full">
                <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                  <div className="flex flex-col pb-3">
                    <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                      Location
                    </dt>
                    <dd className="text-lg font-semibold">
                      {currentUser.location}
                    </dd>
                  </div>
                  <div className="flex flex-col pt-3">
                    <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                      Phone Number
                    </dt>
                    <dd className="text-lg font-semibold">
                      {currentUser.phone}
                    </dd>
                  </div>
                  <div className="flex flex-col pt-3">
                    <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                      Email
                    </dt>
                    <dd className="text-lg font-semibold">
                      {currentUser.email}
                    </dd>
                  </div>
                  <div className="flex flex-col pt-3">
                    <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                      Website
                    </dt>
                    <dd className="text-lg font-semibold hover:text-blue-500">
                      <Link
                        to={currentUser.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {currentUser.website}
                      </Link>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
