import { NextResponse } from 'next/server';
import { predictionMarketAddress, predictionMarketABI } from '@/lib/contracts';
import { createPublicClient, http } from 'viem';
import { hardhat } from 'viem/chains';

const client = createPublicClient({
  chain: hardhat,
  transport: http(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const marketId = params.id;
    
    const data = await client.readContract({
      address: predictionMarketAddress,
      abi: predictionMarketABI,
      functionName: 'markets',
      args: [BigInt(marketId)],
    });

    if (!Array.isArray(data)) {
      throw new Error('Invalid market data format');
    }

    const market = {
      question: data[0],
      resolutionTime: data[1],
      resolved: data[2],
      winningOutcome: data[3],
      bettingAsset: data[4],
    };

    return NextResponse.json(market);
  } catch (error) {
    console.error('Error fetching market:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
} 