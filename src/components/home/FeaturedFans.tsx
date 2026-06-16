import Image from "next/image";

import { Button, Card, CardContent } from "@/components/ui";

import { fansData } from "@/mocks/fans";

export const FeaturedFans = () => {
  return (
    <section className="container w-11/12 max-w-content mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fansData.map((fan) => (
          <Card key={fan.id} className="bg-white border-gray-200">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src={fan.image} 
                  alt={fan.title}
                  width={160}
                  height={160}
                  className="w-40 h-40 object-contain mx-auto"
                />
              </div>
              <h3 className="text-lg font-subheading mb-1">{fan.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{fan.description}</p>
              <Button 
                variant="outline" 
                className="border-gray-300 hover:bg-gray-100 rounded-full text-sm"
              >
                {fan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

