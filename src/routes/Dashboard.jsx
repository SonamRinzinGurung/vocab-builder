import PropTypes from "prop-types";
import ReviewSession from "../components/review/ReviewSession.jsx";
import useDueWords from "../hooks/useDueWords.jsx";
import useUserStats from "../hooks/useUserStats.jsx";
import PageLayout from "../components/PageLayout.jsx";

const Dashboard = ({ user }) => {
    const { dueWords, unReviewed, refetchDueWords } = useDueWords(user.uid);
    const { userStats } = useUserStats(user.uid);
    return (
        <PageLayout heading="Dashboard" subHeading="your learning progress at a glance">
            <ReviewSession dueWords={dueWords} userStats={userStats} unReviewed={unReviewed} refetchDueWords={refetchDueWords} />
        </PageLayout>
    )
}

export default Dashboard
Dashboard.propTypes = {
    user: PropTypes.object.isRequired,
};