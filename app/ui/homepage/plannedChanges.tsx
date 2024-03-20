export default function PlannedChanges(){
    return(
        <div className=" mt-2">
            <h3 className="font-bold text-xl">Planned Improvements</h3>
            <table>
                <thead>
                    <tr>
                        <th className="hidden">No.</th>
                        <th className="hidden">Change</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="min-w-5 align-top">
                            <div className=" float-left text-center">●</div>
                        </td>
                        <td>
                            <p>Multi-part recipes</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">
                            <div className="float-left text-center">●</div>
                        </td>
                        <td>
                            <p>Support for videos</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">
                            <div className="float-left text-center">●</div>
                        </td>
                        <td>
                            <p>Preview before recipe creation</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">
                            <div className="float-left text-center">●</div>
                        </td>
                        <td>
                            <p>Ability to save drafts of unfinished recipes for completion later</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">
                            <div className="float-left text-center">●</div>
                        </td>
                        <td>
                            <p>Ability to bookmark recipes that are not your own</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">
                            <div className="float-left text-center">●</div>
                        </td>
                        <td>
                            <p>Ability to create recipe without an account (resulting recipe may not be saved permanently) </p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">
                            <div className="float-left text-center">●</div>
                        </td>
                        <td>
                            <p>Share directly to social media, rather than having to manually copy and paste recipe link</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">
                            <div className="float-left text-center">●</div>
                        </td>
                        <td>
                            <p>Comments section</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">
                            <div className="float-left text-center">●</div>
                        </td>
                        <td>
                            <p>Rating system</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}