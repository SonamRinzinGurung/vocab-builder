import PropTypes from "prop-types";
import ReviewSession from "../components/review/ReviewSession.jsx";
import useDueWords from "../hooks/useDueWords.jsx";
import useUserStats from "../hooks/useUserStats.jsx";
import PageLayout from "../components/PageLayout.jsx";
import StreaksCard from "../components/Stats/StreaksCard.jsx";
import XPCard from "../components/Stats/XPCard.jsx";
import MasteryStatsCard from "../components/Stats/MasteryStatsCard.jsx";

const Dashboard = ({ user }) => {
    const { dueWords, unReviewed, refetchDueWords } = useDueWords(user.uid);
    const { userStats, refetchUserStats } = useUserStats(user.uid);
    return (
        <PageLayout heading="Your Stats" subHeading="and learning progress at a glance">
            <ReviewSession dueWords={dueWords} userStats={userStats} unReviewed={unReviewed} refetchDueWords={refetchDueWords} refetchUserStats={refetchUserStats} />
            <MasteryStatsCard user={user} />
            <XPCard xpToday={userStats?.xpToday || 0} lifetimeXp={userStats?.lifetimeXp || 0} />
            <StreaksCard userStats={userStats} />
        </PageLayout>
    )
}

export default Dashboard
Dashboard.propTypes = {
    user: PropTypes.object.isRequired,
};