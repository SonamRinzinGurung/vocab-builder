import PropTypes from "prop-types";
import ReviewSession from "../components/review/ReviewSession.jsx";
import useDueWords from "../hooks/useDueWords.jsx";
import useUserStats from "../hooks/useUserStats.jsx";

const Dashboard = ({ user }) => {
    const { dueWords, unReviewed, refetchDueWords } = useDueWords(user.uid);
    const { userStats } = useUserStats(user.uid);
    // console.log(userStats)
    return (
        <main className="mx-4 lg:ml-8 my-10">
            <h1 className="text-start mb-6">Dashboard</h1>
            <ReviewSession dueWords={dueWords} userStats={userStats} unReviewed={unReviewed} refetchDueWords={refetchDueWords} />
        </main>
    )
}

export default Dashboard
Dashboard.propTypes = {
    user: PropTypes.object.isRequired,
};