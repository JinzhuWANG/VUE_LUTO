// Ranking Cards Element
// This component displays ranking cards with progress indicators for various metrics

window.RankingCards = {
  props: {
    selectRegion: {
      type: String,
      default: 'AUSTRALIA'
    },
    selectYear: {
      type: Number,
      default: 2020
    }
  },

  setup(props) {
    const { computed } = Vue;

    const rankingData = computed(() => {
      return window.DataService.getRankingData(props.selectRegion, props.selectYear);
    });

    return {
      rankingData
    };
  },

  template: `
    <div class="flex flex-col">
      <p class="text-black text-xl font-bold p-2">Overall Ranking</p>

      <div class="flex justify-between gap-2">

        <!-- Economics -->
        <div class="flex-2 w-full w-min-[300px] bg-gradient-to-r from-[#e6b980] to-[#eacda3] rounded-lg p-2 shadow-md">
          <p class="text-white mb-4">Revenue</p>
          <div class="flex justify-between w-full gap-1">
            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Economy.Revenue.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col h-full relative">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Economy.Revenue.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Revenue</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Economy.Cost.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Economy.Cost.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Cost</span>
                  </div>
                </div>
              </template>
            </el-progress>
          </div>
        </div>

        <!-- Area -->
        <div class="flex-4 w-full bg-gradient-to-r from-[#edde54] to-[#78cc7a] rounded-lg p-2 shadow-md">
          <p class="text-white mb-4">Area</p>
          <div class="flex items-center justify-between gap-1">
            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Area.Ag.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Area.Ag.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Ag Land</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Area.Am.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Area.Am.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Ag Mgt</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Area.NonAg.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Area.NonAg.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Non-Ag</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Area.Total.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Area.Total.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Total</span>
                  </div>
                </div>
              </template>
            </el-progress>
          </div>
        </div>
        
        <!-- GHG -->
        <div class="flex-2 w-full bg-gradient-to-r from-[#f4355c] to-[#f66137] rounded-lg p-2 shadow-md">
          <p class="text-white mb-4">GHG</p>
          <div class="flex items-center justify-between gap-1">
            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.GHG.Emissions.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.GHG.Emissions.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[11px] text-gray-800">Emissions</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.GHG.Sequestration.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.GHG.Sequestration.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[11px] text-gray-800">Reduction</span>
                  </div>
                </div>
              </template>
            </el-progress>
          </div>
        </div>
        
        <!-- Water -->
        <div class="flex-4 w-full bg-gradient-to-r from-[#1574ef] to-[#0dcdef] rounded-lg p-2 shadow-md">
          <p class="text-white mb-4">Water</p>
          <div class="flex items-center justify-between gap-1">
            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Water_yield.Ag.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Water_yield.Ag.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Ag Land</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Water_yield.Am.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Water_yield.Am.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Ag Mgt</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Water_yield.NonAg.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Water_yield.NonAg.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Non-Ag</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Water_yield.Total.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Water_yield.Total.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Total</span>
                  </div>
                </div>
              </template>
            </el-progress>
          </div>
        </div>
        
        <!-- Biodiversity -->
        <div class="flex-4 w-full bg-gradient-to-r from-[#696969] to-[#c1c6d0] rounded-lg p-2 shadow-md">
          <p class="text-white mb-4">Biodiversity</p>
          <div class="flex items-center justify-between gap-1">
            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Biodiversity.Ag.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Biodiversity.Ag.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Ag Land</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Biodiversity.Am.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Biodiversity.Am.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Ag Mgt</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Biodiversity.NonAg.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Biodiversity.NonAg.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Non-Ag</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="87" 
              :percentage="rankingData.Biodiversity.Total.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div>
                    <span class="text-[13px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[13px] text-white">{{ rankingData.Biodiversity.Total.Rank }} / 56</span>
                  </div>
                  <div class="mt-5">
                    <span class="text-[13px] text-gray-800">Total</span>
                  </div>
                </div>
              </template>
            </el-progress>
          </div>
        </div>
      </div>
    </div>
  `,
};