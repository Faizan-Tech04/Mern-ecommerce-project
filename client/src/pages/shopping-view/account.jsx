import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";

import accountImage from "../../assets/account.jpg";

import Address from "@/components/shopping-view/address";

import ShoppingOrders from "@/components/shopping-view/orders";


// ==========================================
// Shopping Account
// ==========================================

function ShoppingAccount() {

    return (
        <div className="flex min-h-screen w-full flex-col">


            {/* ==========================================
                Account Hero
            ========================================== */}

            <section className="relative h-[250px] w-full overflow-hidden sm:h-[300px] md:h-[350px]">

                <img
                    src={accountImage}
                    alt="My Account"
                    className="h-full w-full object-cover object-center"
                />


                {/* ==========================================
                    Overlay
                ========================================== */}

                <div className="absolute inset-0 bg-black/45" />


                {/* ==========================================
                    Hero Heading
                ========================================== */}

                <div className="absolute inset-0 flex items-center justify-center px-4">

                    <h1 className="text-center text-3xl font-bold text-white drop-shadow-md sm:text-4xl md:text-5xl">
                        My Account
                    </h1>

                </div>

            </section>


            {/* ==========================================
                Account Content
            ========================================== */}

            <section className="w-full bg-gray-50 py-8 sm:py-10 md:py-12">

                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

                    <div className="w-full rounded-2xl border bg-white p-4 shadow-sm sm:p-6 md:p-8">


                        {/* ==========================================
                            Account Tabs
                        ========================================== */}

                        <Tabs
                            defaultValue="orders"
                            className="w-full"
                        >


                            {/* ==========================================
                                Tabs Navigation
                            ========================================== */}

                            <TabsList
                                className="
                                    flex
                                    h-auto
                                    w-full
                                    justify-start
                                    gap-0
                                    rounded-none
                                    border-b
                                    border-gray-200
                                    bg-transparent
                                    p-0
                                "
                            >

                                {/* ======================================
                                    Orders Tab
                                ====================================== */}

                                <TabsTrigger
                                    value="orders"
                                    className="
                                        relative
                                        flex-1
                                        rounded-none
                                        border-0
                                        border-b-2
                                        border-transparent
                                        bg-transparent
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-gray-500
                                        shadow-none
                                        transition-all

                                        hover:bg-transparent
                                        hover:text-black

                                        data-[state=active]:!border-black
                                        data-[state=active]:!bg-transparent
                                        data-[state=active]:!text-black
                                        data-[state=active]:!shadow-none

                                        sm:text-base
                                    "
                                >
                                    Orders
                                </TabsTrigger>


                                {/* ======================================
                                    Address Tab
                                ====================================== */}

                                <TabsTrigger
                                    value="address"
                                    className="
                                        relative
                                        flex-1
                                        rounded-none
                                        border-0
                                        border-b-2
                                        border-transparent
                                        bg-transparent
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-gray-500
                                        shadow-none
                                        transition-all

                                        hover:bg-transparent
                                        hover:text-black

                                        data-[state=active]:!border-black
                                        data-[state=active]:!bg-transparent
                                        data-[state=active]:!text-black
                                        data-[state=active]:!shadow-none

                                        sm:text-base
                                    "
                                >
                                    Address
                                </TabsTrigger>

                            </TabsList>


                            {/* ==========================================
                                Orders Content
                            ========================================== */}

                            <TabsContent
                                value="orders"
                                className="mt-6 focus-visible:outline-none"
                            >

                                <ShoppingOrders />

                            </TabsContent>


                            {/* ==========================================
                                Address Content
                            ========================================== */}

                            <TabsContent
                                value="address"
                                className="mt-6 focus-visible:outline-none"
                            >

                                <Address />

                            </TabsContent>


                        </Tabs>

                    </div>

                </div>

            </section>

        </div>
    );
}


export default ShoppingAccount;