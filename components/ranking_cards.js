// Ranking Cards Element
// This component displays ranking cards with progress indicators for various metrics

window.RankingCards = {
  props: {
    selectRegion: {
      type: String,
    },
    selectYear: {
      type: Number,
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
    
      <div class="flex justify-between gap-1">

        <!-- Economics -->
        <div v-if="rankingData" class="flex-2 w-full w-min-[300px] bg-gradient-to-r from-[#e6b980] to-[#eacda3] rounded-lg p-1 shadow-md">
          <p class="text-white mb-4">Economics</p>
          <div class="flex justify-between w-full gap-1">
            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Economics.Revenue.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col h-full relative">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Economics.Revenue.value }} $</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Revenue</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Economics.Cost.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Economics.Cost.value }} $</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Cost</span>
                  </div>
                </div>
              </template>
            </el-progress>
          </div>
        </div>

        <!-- Area -->
        <div class="flex-4 w-full bg-gradient-to-r from-[#78cc7a] to-[#edde54] rounded-lg p-1 shadow-md">
          <p class="text-white mb-4">Area</p>
          <div class="flex items-center justify-between gap-1">
            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Area.Ag.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Area.Ag.value }} ha</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Ag Land</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Area.Am.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Area.Am.value }} ha</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Ag Mgt</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Area.NonAg.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Area.NonAg.value }} ha</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Non-Ag</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Area.Total.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Area.Total.value }} ha</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Total</span>
                  </div>
                </div>
              </template>
            </el-progress>
          </div>
        </div>
        
        <!-- GHG -->
        <div class="flex-2 w-full bg-gradient-to-r from-[#f46489] to-[#f088e1] rounded-lg p-1 shadow-md">
          <p class="text-white mb-4">GHG</p>
          <div class="flex items-center justify-between gap-1">
            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.GHG.Emissions.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.GHG.Emissions.value }} t</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Emissions</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.GHG.Sequestration.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.GHG.Sequestration.value }} t</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Reduction</span>
                  </div>
                </div>
              </template>
            </el-progress>
          </div>
        </div>
        
        <!-- Water -->
        <div class="flex-4 w-full bg-gradient-to-r from-[#4fadff] to-[#07f0fe] rounded-lg p-1 shadow-md">
          <p class="text-white mb-4">Water</p>
          <div class="flex items-center justify-between gap-1">
            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Water.Ag.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Water.Ag.value }} ML</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Ag Land</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Water.Am.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Water.Am.value }} ML</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Ag Mgt</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Water.NonAg.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Water.NonAg.value }} ML</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Non-Ag</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Water.Total.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Water.Total.value }} ML</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Total</span>
                  </div>
                </div>
              </template>
            </el-progress>
          </div>
        </div>
        
        <!-- Biodiversity -->
        <div class="flex-4 w-full bg-gradient-to-r from-[#666adf] to-[#ecd3fe] rounded-lg p-1 shadow-md">
          <p class="text-white mb-4">Biodiversity</p>
          <div class="flex items-center justify-between gap-1">
            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Biodiversity.Ag.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Biodiversity.Ag.value }} ha</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Ag Land</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Biodiversity.Am.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Biodiversity.Am.value }} ha</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Ag Mgt</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Biodiversity.NonAg.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Biodiversity.NonAg.value }} ha</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Non-Ag</span>
                  </div>
                </div>
              </template>
            </el-progress>

            <el-progress 
              type="dashboard" 
              width="75" 
              :percentage="rankingData.Biodiversity.Total.Percent" 
              color="#56a771" 
              stroke-width="3"
            >
              <template #default="{ percentage }">
                <div class="flex flex-col justify-between h-full">
                  <div class="space-y-1">
                    <span class="text-[11px] text-white">{{ percentage }}%</span> <br>
                    <span class="text-[11px] text-white">{{ rankingData.Biodiversity.Total.value }} ha</span>
                  </div>
                  <div class="mt-2">
                    <span class="text-[11px] text-gray-800">Total</span>
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