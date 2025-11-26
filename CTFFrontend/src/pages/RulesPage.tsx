import Container from "@/components/main/Containers";
import Page from "@/components/main/Page";
import { FaBookDead } from "react-icons/fa";
import { PiHouseBold } from "react-icons/pi";
import { Link } from "react-router-dom";

const RulesPage = () => {
    return (
        <Page>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                    <h2
                        className="text-4xl"
                        style={{ fontFamily: "American Captain" }}
                    >
                        Official Rules
                    </h2>
                    <Link to="/">
                        <div className="w-8 h-8 bg-amber-400 text-black rounded text-2xl flex items-center justify-center">
                            <PiHouseBold />
                        </div>
                    </Link>
                </div>
                <p>
                    In the event of an emergency, return to the rendezvous point immediately.
                </p>
                <Container title="Quick start" padding={false} Icon={FaBookDead}>
                    <div className="py-2 px-2 flex flex-col gap-4">
                        <p>
                            The objective of the game is to capture the Flag of an enemy team and bring it back to your base, all while defending your Flag.
                        </p>
                        <p>
                            The game has three periods:
                        </p>
                        <ul className="list-disc pl-4 flex flex-col gap-2">
                            <li>Grace period: Safe time to plant and register team Flag/base locations.</li>
                            <li>Scouting period: Find and capture an enemy Flag while avoiding elimination.</li>
                            <li>Reveal period: All base locations are revealed.</li>
                        </ul>
                        <p>
                            You're eliminated if your tag is removed by an enemy. You must then return to your base to revive. If you eliminate a player,
                            you keep their tag. Players with the most eliminations are commended.
                        </p>
                        <p>
                            Each team is provided with twice the number of tags as there are players in the largest team. When a team runs out, they are no long able to revive.
                        </p>
                        <p>
                            Flags and tags must always be visible. A team's base is a circular area of radius 5 metres around their Flag. Once placed, team members
                            cannot generally enter their base.
                        </p>
                        <p>
                            If you bring an enemy Flag to your base, you must declare victory. If victory is not declared in time, the game ends in a tie.
                        </p>
                    </div>
                </Container>
                <h2
                    className="text-3xl"
                    style={{ fontFamily: "American Captain" }}
                >
                    Objective
                </h2>
                <p>
                    To win Capture the Flag, you must declare victory with every Flag safely at your base before the time runs out. At the same time,
                    you must protect your Flag while avoiding elimination. If victory is not declared, the hierarchy of winning conditions follows:
                </p>
                <ul className="list-disc pl-4 flex flex-col gap-2">
                    <li>Number of Flags safely at a team base;</li>
                    <li>Number of enemy tags in a team's posession;</li>
                    <li>Least lives lost as a team;</li>
                </ul>
                <p>
                    If none of these win conditions are met, the game is considered a tie.
                </p>
                <hr />
                <h2
                    className="text-3xl"
                    style={{ fontFamily: "American Captain" }}
                >
                    Rules
                </h2>
                <ol className="list-decimal pl-4 flex flex-col gap-2">
                    <li>
                        The most important rule is that all players play in good faith. The game is run on an honour code and requires universal cooperation.
                        Any player who is found willingly breaking the rules or trying to subvert the rules will be asked to leave.
                    </li>
                    <li>The game structure is separated into several phases, wherein certain actions are permitted. Each pahse lasts for a set amount of at,
                        at the end of which the next phase will commence, provided all game criteria have been met. The remaining time of each phase can be
                        found on the application homepage.
                    </li>
                    <li>
                        Phase 1 is the Grace Period, where teams must register the location of their base using the app.
                    </li>
                    <ol className="list-[upper-roman] pl-8">
                        <li>
                            Players are not permitted to knowingly leave their team's territory during this phase.
                        </li>
                        <li>
                            Flags must be registered on the game map in the same location the are placed in real life.
                        </li>
                        <li>
                            Failure of a team to register their Flag will result in a suspension of the game until registration is complete. Should a team
                            take an excessive amount of time to complete their registration, that team shall be disqualified by an administrator.
                        </li>
                        <li>
                            Flags must be placed and registered in a legal, accessible and fair location. See Rule ### for Flag placement rules and etiquette.
                        </li>
                    </ol>
                    <li>
                        Phase 2 is the Scouting Period. Players are now permitted to leave their team's territory in order to search for the location of
                        other Flags and capture them.
                    </li>
                    <ol className="list-[upper-roman] pl-8">
                        <li>
                            Players can now be eliminated. For elimination rules and regulations, see Rule ###.
                        </li>
                        <li>
                            Flags are not considered safe unless they are within your base and not held by any player (see Rule ###).
                        </li>
                        <li>
                            Flags are not considered captured until they are taken to a team's base. In order to declare victory, all Flags must be
                            at the declaring team's location.
                        </li>
                    </ol>
                    <li>
                        Phase 3 is the Reveal Period. This phase reveals all teams' registered base locations, and marks the final phase of the game.
                        The phase runs similarly to the Scouting Period.
                    </li>
                    <li>
                        If victory isn't declared by the end of the Reveal Period, the following win conditions are considered one at a time in order.

                    </li>
                    <ol className="list-[upper-roman] pl-8">
                        <li>
                            The victor of each condition being the team with the highest number in the category of:
                        </li>
                        <ol className="list-[upper-roman] pl-8">
                            <li>Flags safely at the team's base;</li>
                            <li>Enemy tags in the team's posession;</li>
                            <li>Remaining lives for the team (including active players);</li>
                        </ol>
                        <li>
                            If there is no defined winner, then the game is considered a tie.
                        </li>
                    </ol>
                    <li>
                        The Flags are the central objects and objectives of the game of Capture the Flag.
                    </li>
                    <ol className="list-[upper-roman] pl-8">
                        <li>Each team must possess a single Flag for their team.</li>
                        <li>
                            All Flags must be of uniform size and shape, and of a vibrant colour representative of the team that registers it.
                        </li>
                        <li>An appropriate location for a Flag is defined as follows:</li>
                        <ol className="list-[upper-roman] pl-8">
                            <li>Flags must not be diguised or concealed by any player, at any point during the game (including when being captured);</li>
                            <li>Flags must not tied off or otherwise affixed to any point or terrain feature that would render it impossible to easily
                                remove. Easy removal of a Flag constitutes picking up with a one-handed grip without needing to displace any obstacles;
                            </li>
                            <li>Flags cannot be purposefully damaged;</li>
                            <li>Flags stationed at a team's base should have at least 180 degrees of continuous open space and not be within 5 metres of a major obstacle;</li>
                        </ol>
                        <li>
                            Should a player be eliminated while holding a flag, they must plant or place the flag down exactly where they have been eliminated.
                            The flag can be immediately recaptured.
                        </li>
                        <li>When carrying a flag, you are still permitted to eliminate enemy players.</li>
                        <li>
                            Players are not permitted to hand off their flag to another player after they have been eliminated.
                        </li>
                    </ol>
                    <li>
                        The base (or your team's registered flag location) is the area to which you must return the flags in order to win. After deciding your team's flag location,
                        your base is considered the circular area of radius 5 metres around it.
                    </li>
                    <ol className="list-[upper-roman] pl-8">
                        <li>
                            To the best of your ability, this area should be free of any walls or similar major obstacles.
                        </li>
                        <li>
                            During the game, team members cannot enter their base area unless it is to plant a flag or to revive.
                            You may not eliminate enemy players inside this area.
                        </li>
                    </ol>
                </ol>
            </div>
        </Page>
    )
}

export default RulesPage;