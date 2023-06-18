import { useSelector } from "react-redux";


const home = () => {
    const token = useSelector((state:any) => state.auth.token);


    return (
        <div>
            {token}
        </div>
    );
}

export default home;