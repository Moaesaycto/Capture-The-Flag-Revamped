import { useState, type ChangeEvent } from "react";
import Page from "../components/main/Page";

const HomePage = () => {
    const [wantsAuth, setWantsAuth] = useState<boolean>(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    }
    return (
        <Page>
            Hi this is me testing to see if the font is actually working
            <form onSubmit={onSubmit}>
                <input
                    className="bg-neutral-800"
                    name="name"
                    placeholder="Enter Name"
                />
                <div>
                    <input
                        type="checkbox"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => { setWantsAuth(e.target.checked) }}
                    />
                    <label>Auth?</label>
                </div>
                {wantsAuth && <div>
                    <input
                        className="bg-neutral-800"
                        name="password"
                    /><label>Password</label>
                </div>}
                <button type="submit">Submit</button>
            </form>
        </Page>
    )
}

export default HomePage;