import React, {useState} from 'react';
import HomePanelButton from '../../components/HomePanelButton/HomePanelButton';

function HomePage(props) {
    const [currentDashboards, setCurrentDashboards] = useState( [{name: 'Bank', id: 0}, {name: 'Healthcare', id: 1}]);

    function onCloseButtonClick(__id) {
        let newpanels = [];
        for (let n = 0; n < currentDashboards.length; n++)
            if (!(currentDashboards[n].id === __id))
                newpanels.push(currentDashboards[n]);
        setCurrentDashboards(newpanels);
    }

    function onAddButtonClick() {
        let newpanels = [], n;
        for (n = 0; n < currentDashboards.length; n++)
            newpanels.push(currentDashboards[n]);
        newpanels.push({
            name: 'new dashboard',
            id: n
        });

        setCurrentDashboards(newpanels);
    }

    return (
        <div>
            {(() => {
                return currentDashboards.map((dashboard) => {
                    return <HomePanelButton panel={dashboard} key={dashboard.id} isAddButton={false} action={onCloseButtonClick} />;
                });
            })()}
            <HomePanelButton isAddButton={true} action={onAddButtonClick} />
        </div>
    );
}

export default HomePage;