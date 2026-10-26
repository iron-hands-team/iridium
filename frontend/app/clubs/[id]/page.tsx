import type { Metadata } from "next";
import type { ClubResponse, ClubMemberResponse } from "@/types/clubs";
import type { ChannelType } from "@/lib/schemas";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { parseUser } from "@/lib/helpers";
import ClubDetail from "@/components/clubs/club-detail";

export const metadata: Metadata = {
    title: "Club",
};

async function Page({ params }: { params: Promise<{ id: number}>}) {
    const {id} = await params;
    const {user,cookie} = await getSession();

    const clubsData: ClubResponse[] = await fetch(
        `${process.env.INTERNAL_API_URL}/clubs`,
        {
           method: "GET",
           headers: {
            Authorization: `Bearer ${cookie.value}`,
            "Content-Type": "application/json",
           },
        },
    ).then((res)=>res.json());
    const foundClub = clubsData.find((c)=>c.id==id);
    if (!foundClub) notFound();
    const club = {
        ...foundClub,
        sponsor: foundClub.sponsor ? parseUser(foundClub.sponsor) : undefined,
    };

    const membersData: ClubMemberResponse[] = await fetch(
        `${process.env.INTERNAL_API_URL}/clubs/${id}/members`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookie.value}`,
                "Content-Type": "application/json"
            },
        },
    ).then((res)=>res.json());
    const members = membersData.map((m)=>({
        id: m.id,
        user: parseUser(m.user),
    }));

    const channelsData: ChannelType[] = await fetch(
        `${process.env.INTERNAL_API_URL}/chat/channels`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookie.value}`,
                "Content-Type": "application/json",
            },
        },
    ).then((res)=>res.json());
    const channel = channelsData.find((c)=>c.club?.id==id);

    return (
        <div className="px-50 py-10">
            <ClubDetail
                club={club}
                members={members}
                currentUser={user}
                channelId={channel?.id}
            />
        </div>
    );
}

export default Page;