"use server";

import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Tailwind,
    Text,
} from "@react-email/components";

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://www.floffah.dev";

function VerifyEmail({ verificationCode }: { verificationCode: string }) {
    return (
        <Tailwind>
            <Head />
            <Html>
                <Body
                    className="bg-white"
                    style={{
                        fontFamily:
                            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
                    }}
                >
                    <Preview>Your login code for floffah.dev</Preview>
                    <Container className="mx-auto my-0 px-4 pt-4 pb-12">
                        <Img
                            src={`${baseUrl}/floffah.png`}
                            alt="floffah"
                            className="w-10"
                        />

                        <Heading className="text-2xl font-normal">
                            Your login code for floffah.dev
                        </Heading>
                        <Text className="m-0 mx-0 mb-4 text-sm font-light">
                            This code will expire in 10 minutes
                        </Text>

                        <Text className="m-0 my-2.5 rounded-lg bg-gray-200 px-20 py-2 text-center text-2xl font-bold text-black">
                            {verificationCode}
                        </Text>

                        <Hr className="my-10 border-gray-300" />

                        <Link
                            href="https://www.floffah.dev"
                            className="text-sm font-semibold text-gray-500"
                        >
                            floffah.dev
                        </Link>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    );
}

VerifyEmail.PreviewProps = {
    verificationCode: "123456",
};

export default VerifyEmail;
