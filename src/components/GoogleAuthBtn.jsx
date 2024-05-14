import PropTypes from "prop-types";
import { FaGoogle } from "react-icons/fa";

const GoogleAuthBtn = ({ handleGoogleSignIn }) => {

    return <button
        onClick={handleGoogleSignIn}
        className="flex items-center gap-4 border p-2 justify-center self-center rounded-sm"
    >
        <div>
            <FaGoogle color="#4285F4" size={30} />
        </div>
        <p className="font-subHead font-medium text-lg">
            Continue with Google
        </p>
    </button>
}

export default GoogleAuthBtn;

GoogleAuthBtn.propTypes = {
    handleGoogleSignIn: PropTypes.func.isRequired
}
