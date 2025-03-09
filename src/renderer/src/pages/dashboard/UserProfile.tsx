import DashboardComp from "@renderer/components/layout/Dashboard.comp";

const UserProfile = () => {
    return (
        <div id="profile-page">
            <DashboardComp context="profile" />
        </div>
    );
};

export default UserProfile;
