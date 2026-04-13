import {getCurrentUser} from "@/lib/actions/auth.action";
import {getFeedbackByInterviewId, getInterviewById} from "@/lib/actions/general.action";
import {redirect} from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const user = await getCurrentUser();

    const interview = await getInterviewById(id);
    if(!interview) redirect('/');

    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: user?.id!,
    });

    return (
        <section className="section-feedback flex flex-col gap-10 px-4 md:px-8 w-full overflow-x-hidden">

            <div className="flex flex-col justify-center text-center w-full">
                {/* Changed text size for mobile and added break-words */}
                <h1 className="text-3xl md:text-4xl font-semibold break-words">
                    Feedback on the Interview - <br className="sm:hidden" />
                    <span className="capitalize text-primary-200">{interview.role}</span> Interview
                </h1>
            </div>

            <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/star.svg" width={22} height={22} alt="star"/>
                        <p className="text-lg">
                            Overall Impression:{" "}
                            <span className="text-primary-200 font-bold text-xl">
                                {feedback?.totalScore}
                            </span>
                            /100
                        </p>
                    </div>

                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/calendar.svg" width={22} height={22} alt="calendar"/>
                        <p className="text-gray-400">
                            {feedback?.createdAt
                                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A") : "N/A"}
                        </p>
                    </div>
                </div>

                <hr className="border-gray-800" />

                <div className="flex flex-col gap-3">
                    <h2 className="text-2xl font-bold">Final Assessment</h2>
                    <p className="leading-relaxed text-gray-300">{feedback?.finalAssessment}</p>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">Breakdown of the Interview:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feedback?.categoryScores?.map((category: any, index: number) => (
                            <div key={index} className="bg-dark-300 p-5 rounded-xl border border-gray-800">
                                <p className="font-bold text-lg mb-2">
                                    {index + 1}. {category.name} <span className="text-primary-200">({category.score}/100)</span>
                                </p>
                                <p className="text-sm text-gray-400">{category.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3 bg-green-950/20 p-5 rounded-xl border border-green-900/30">
                        <h3 className="text-xl font-bold text-green-500">Strengths</h3>
                        <ul className="list-disc pl-5 flex flex-col gap-2">
                            {feedback?.strengths?.map((strength: string, index: number) => (
                                <li key={index} className="text-gray-300 break-words">{strength}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3 bg-red-950/20 p-5 rounded-xl border border-red-900/30">
                        <h3 className="text-xl font-bold text-red-500">Areas for Improvement</h3>
                        <ul className="list-disc pl-5 flex flex-col gap-2">
                            {feedback?.areasForImprovement?.map((area: string, index: number) => (
                                <li key={index} className="text-gray-300 break-words">{area}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 mb-10 w-full">
                    {/* Dark Pill Button */}
                    <Button className="w-full sm:w-[400px] bg-dark-300 hover:bg-dark-400 text-white rounded-full h-12" asChild>
                        <Link href="/" className="flex justify-center items-center">
                            <span className="text-base font-semibold text-center">
                                Back to Dashboard
                            </span>
                        </Link>
                    </Button>

                    <Button className="w-full sm:w-[400px] bg-primary-200 hover:bg-primary-200/90 text-dark-100 rounded-full h-12" asChild>
                        <Link href={`/interview/${id}`} className="flex justify-center items-center">
                            <span className="text-base font-bold text-center">
                                Retake Interview
                            </span>
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
export default Page;