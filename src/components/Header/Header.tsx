import React, { Suspense, lazy } from "react";
import { faBell, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { results } from "../../constants";
import Style from "./css/styles.module.css";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { organizations } from "../../constants";
import { Profile } from "../../assets";
const LiveSearch = lazy(() => import("../LiveSearch/LiveSearch"));
const Switch = lazy(() => import("../SwitchModule/SwitchModule"));
type Props = {
  mobileNav: boolean;
  handleMobileNav?: () => void;
  handleLogout: () => void;
  toggleOrganization: (string: string) => void;
  organization: string;
};

type Profile = {
  name: string;
  profileImage: string;
  role: string;
};

const Header: React.FC<Props> = ({
  mobileNav,
  handleMobileNav,
  // handleLogout,
  toggleOrganization,
  organization,
}) => {
  const [profile, setProfile] = React.useState<Profile>({
    name: "",
    profileImage: "",
    role: "",
  });
  const [searchResults, setSearchResults] =
    React.useState<
      {
        id: string;
        name: string;
      }[]
    >();
  const [selectedProfile, setSelectedProfile] =
    React.useState<{
      id: string;
      name: string;
      role: string;
    }>();

  type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
  const handleChange: changeHandler = (e) => {
    const { target } = e;
    if (!target.value.trim()) return setSearchResults([]);

    const filteredValue = results.filter((result) =>
      result.name.toLowerCase().startsWith(target.value)
    );

    setSearchResults(filteredValue);
  };
  React.useEffect(() => {
    //mimicking network request
    setTimeout(() => {
      setProfile((profile) => ({
        ...profile,
        name: "Henry Okoro",
        profileImage: Profile,
        role: "Payroll Manager",
      }));
    }, 3000);
  }, []);
  return (
    <Suspense>
      <div className={Style.header}>
        <div className={Style.top}>
          <Switch
            mainIcon={faHouse}
            title="Change Organization"
            header={organization || "PaperSoft Limited"}
            links={organizations}
            action={toggleOrganization}
            background="#F6F7F9"
          />
        </div>
        <LiveSearch
          placeholder="Search for anything..."
          results={searchResults}
          onChange={handleChange}
          onSelect={(item: any) => {
            console.log(item);
            setSelectedProfile(item);
          }}
          value={selectedProfile?.name}
          onSubmit={() => {
            if (selectedProfile) console.log(selectedProfile);
          }}
          renderItem={(item: any) => <p className="text-black ">{item.name}</p>}
        />

        <div className={Style.right}>
          <div className={Style.profile_con}>
            <Link to={`/notifications`} className={Style.link_}>
              <FontAwesomeIcon icon={faBell} />
              <span className="absolute bg-[#FF3B30] rounded-full w-[4px] h-[4px]"></span>
            </Link>

            <Link to={`/my/dashboard/account`} className={Style.img_con}>
              <img
                src={
                  profile.profileImage || "https://via.placeholder.com/500x500"
                }
                alt={profile.profileImage}
                className=""
              />
            </Link>

            <div className={Style.profile}>
              <h1 className="">{profile.name ? profile.name : "Anon..."}</h1>
              <p>{profile && profile.role && profile.role}</p>
            </div>
          </div>
          <button
            role="button"
            onClick={handleMobileNav}
            className={Style.burger_btn}
          >
            <FontAwesomeIcon icon={mobileNav ? faTimes : faBars} />
          </button>
        </div>
      </div>
    </Suspense>
  );
};

export default Header;
